import fs from "fs-extra";
import { execSync } from "node:child_process";
import path from "node:path";

import { ConfigManager } from "./config";
import { API_CONSTANTS } from "./constants";

export class ApiGenerator {
  async generateTypesOnly(): Promise<void> {
    const configContent = ConfigManager.create({
      inputSpec: API_CONSTANTS.SWAGGER_FILE,
      outputDir: API_CONSTANTS.OUTPUT_DIR,
      additionalProperties: {
        withSeparateModelsAndApi: true,
        apiPackage: "api",
        modelPackage: "types",
        skipOperationExample: true,
        generateApiDocumentation: false,
        generateApiTests: false,
        generateModelDocumentation: false,
        generateModelTests: false,
        generateSupportingFiles: false,
      },
    });

    await fs.writeFile(API_CONSTANTS.CONFIG_FILE, configContent);

    try {
      execSync(
        "openapi-generator-cli generate -c config-local.yaml --global-property models --global-property apiTests=false --global-property apiDocs=false --global-property modelDocs=false",
        {
          stdio: "inherit",
        }
      );
    } catch (error) {
      throw new Error(`Failed to generate types: ${(error as Error).message}`);
    } finally {
      await this.cleanup();
    }
  }

  private async cleanup(): Promise<void> {
    try {
      await fs.remove(API_CONSTANTS.CONFIG_FILE);
    } catch {
      // Ignore cleanup errors
    }
  }
}
