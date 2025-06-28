export const API_CONSTANTS = {
  SWAGGER_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/v3/api-docs`,
  OUTPUT_DIR: "./src/@generated",
  SWAGGER_FILE: "./swagger.json",
  CONFIG_FILE: "./config-local.yaml",
  TIMEOUT: {
    SERVER_CHECK: 10000,
    DOWNLOAD: 15000,
    COMMAND: 60000,
  },
} as const;

export const GENERATOR_CONFIG = {
  NAME: "typescript-axios",
  API_PACKAGE: "api",
  MODEL_PACKAGE: "types",
  NPM_NAME: "@gamegoo/api-client",
  NPM_VERSION: "1.0.0",
} as const;
