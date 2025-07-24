import chalk from "chalk";
import fs from "fs-extra";

import { ApiServiceGenerator } from "./api-service-generator";
import { API_CONSTANTS } from "./constants";
import { ApiGenerator } from "./generator";
import { checkServerStatus, downloadFile } from "./http";
import { PostProcessor } from "./post-processor";
import { SchemaProcessor } from "./schema";
import type { GenerationOptions } from "./types";

export class ApiGenerationOrchestrator {
  private options: GenerationOptions;

  constructor(options: GenerationOptions = {}) {
    this.options = {
      serverCheck: true,
      forceDownload: true, // 항상 새로운 스키마를 다운로드
      keepTempFiles: false,
      generateServices: true,
      ...options,
    };
  }

  async run(): Promise<void> {
    console.info(chalk.green("🚀 Starting GameGoo API generation..."));

    try {
      await this.cleanup();
      await this.prepareSchema();
      await this.processSchema();
      await this.generateClient();
      await this.postProcess();

      if (this.options.generateServices) {
        await this.generateApiServices();
      }

      this.printSuccess();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private async cleanup(): Promise<void> {
    console.info("🧹 Cleaning existing generated files...");

    if (await fs.pathExists(API_CONSTANTS.OUTPUT_DIR)) {
      await fs.remove(API_CONSTANTS.OUTPUT_DIR);
    }
  }

  private async prepareSchema(): Promise<void> {
    if (this.options.serverCheck) {
      const status = await checkServerStatus(API_CONSTANTS.SWAGGER_URL);

      if (
        status.success &&
        (this.options.forceDownload || !(await this.schemaExists()))
      ) {
        console.info("📡 Downloading OpenAPI schema...");
        await downloadFile(
          API_CONSTANTS.SWAGGER_URL,
          API_CONSTANTS.SWAGGER_FILE
        );
        console.info("✅ Schema downloaded successfully");
      }
    }

    if (!(await this.schemaExists())) {
      console.info("🔄 Creating fallback schema...");
      const fallback = SchemaProcessor.createFallback();
      await fs.writeJSON(API_CONSTANTS.SWAGGER_FILE, fallback, { spaces: 2 });
    }
  }

  private async processSchema(): Promise<void> {
    console.info("🔧 Processing OpenAPI schema...");

    const processor = new SchemaProcessor(API_CONSTANTS.SWAGGER_FILE);
    processor.process();
    processor.save(API_CONSTANTS.SWAGGER_FILE);
  }

  private async generateClient(): Promise<void> {
    console.info("🛠️ Generating TypeScript client...");

    const generator = new ApiGenerator();
    await generator.generateTypesOnly();
  }

  private async postProcess(): Promise<void> {
    console.info("✨ Post-processing generated files...");

    const processor = new PostProcessor(API_CONSTANTS.OUTPUT_DIR);
    await processor.process();
  }

  private async generateApiServices(): Promise<void> {
    console.info("🔨 Generating API service functions...");

    const serviceGenerator = new ApiServiceGenerator(
      API_CONSTANTS.SWAGGER_FILE,
      API_CONSTANTS.OUTPUT_DIR
    );
    await serviceGenerator.generate();
  }

  private async schemaExists(): Promise<boolean> {
    return fs.pathExists(API_CONSTANTS.SWAGGER_FILE);
  }

  private printSuccess(): void {
    console.info("");
    console.info(chalk.green("✅ API generation completed successfully!"));
    console.info(
      `📁 Generated files in: ${chalk.yellow(API_CONSTANTS.OUTPUT_DIR)}`
    );
    console.info("");
    console.info("💡 Usage:");
    console.info(
      `  ${chalk.cyan("import { blockMember } from")} ${chalk.yellow(
        "'@/generated/services/block'"
      )}`
    );
    console.info(
      `  ${chalk.cyan("import type { BlockResponse } from")} ${chalk.yellow(
        "'@/generated/types/block'"
      )}`
    );
  }

  private handleError(error: Error): void {
    console.error("");
    console.error(chalk.red("❌ Error occurred while generating API:"));
    console.error(chalk.red(error.message));
    console.error("");
    process.exit(1);
  }
}
