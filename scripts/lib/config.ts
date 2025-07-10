import yaml from "js-yaml";

import { GENERATOR_CONFIG } from "./constants";

export interface GeneratorConfig {
  inputSpec: string;
  outputDir: string;
  generatorName?: string;
  additionalProperties?: Record<string, any>;
}

export class ConfigManager {
  static create(config: GeneratorConfig): string {
    const fullConfig = {
      generatorName: config.generatorName || GENERATOR_CONFIG.NAME,
      inputSpec: config.inputSpec,
      outputDir: config.outputDir,
      additionalProperties: {
        withSeparateModelsAndApi: true,
        apiPackage: GENERATOR_CONFIG.API_PACKAGE,
        modelPackage: GENERATOR_CONFIG.MODEL_PACKAGE,
        supportsES6: true,
        useSingleRequestParameter: false,
        withoutPrefixEnums: true,
        enumPropertyNaming: "original",
        stringEnums: true,
        removeOperationIdPrefix: true,
        ...config.additionalProperties,
      },
    };

    return yaml.dump(fullConfig, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
    });
  }

  static validate(config: GeneratorConfig): void {
    if (!config.inputSpec || !config.outputDir) {
      throw new Error("Missing required configuration fields");
    }
  }
}
