import fs from "fs-extra";

import { SwaggerSchema } from "./types";

export class SchemaProcessor {
  private schema: SwaggerSchema;

  constructor(schemaPath: string) {
    const content = fs.readFileSync(schemaPath, "utf8");
    this.schema = JSON.parse(content);
  }

  process(): void {
    this.fixSecuritySchemes();
    this.fixSecurityReferences();
    this.addCustomTypes();
  }

  save(outputPath: string): void {
    fs.writeFileSync(outputPath, JSON.stringify(this.schema, null, 2));
  }

  private fixSecuritySchemes(): void {
    if (!this.schema.components?.securitySchemes) return;

    const fixed: Record<string, any> = {};

    Object.entries(this.schema.components.securitySchemes).forEach(
      ([key, value]) => {
        const validName = this.sanitizeName(key);
        fixed[validName] = value;

        if (key !== validName) {
          console.info(`✅ Fixed security scheme: ${key} -> ${validName}`);
        }
      }
    );

    this.schema.components.securitySchemes = fixed;
  }

  private fixSecurityReferences(): void {
    // Fix global security
    if (this.schema.security) {
      this.schema.security = this.schema.security.map((item) =>
        this.transformSecurityItem(item)
      );
    }

    // Fix path security
    if (this.schema.paths) {
      Object.values(this.schema.paths).forEach((pathItem) => {
        this.fixPathItemSecurity(pathItem);
      });
    }
  }

  private fixPathItemSecurity(pathItem: any): void {
    if (!pathItem || typeof pathItem !== "object") return;

    Object.values(pathItem).forEach((operation: any) => {
      if (operation?.security) {
        operation.security = operation.security.map((item: any) =>
          this.transformSecurityItem(item)
        );
      }
    });
  }

  private transformSecurityItem(
    item: Record<string, any>
  ): Record<string, any> {
    const transformed: Record<string, any> = {};

    Object.entries(item).forEach(([key, value]) => {
      transformed[this.sanitizeName(key)] = value;
    });

    return transformed;
  }

  private sanitizeName(name: string): string {
    return name.replace(/[^a-zA-Z0-9\.\-_]/g, "_");
  }

  private addCustomTypes(): void {
    if (!this.schema.components) {
      this.schema.components = {};
    }

    if (!this.schema.components.schemas) {
      this.schema.components.schemas = {};
    }

    this.schema.components.schemas.ApiResponse = {
      type: "object",
      properties: {
        status: { type: "integer", description: "HTTP status code" },
        message: { type: "string", description: "Response message" },
        code: { type: "string", description: "Response code" },
        data: { description: "Response data" },
      },
      required: ["status", "message", "code"],
    };

    console.info("✅ Added custom types to schema");
  }

  static createFallback(): SwaggerSchema {
    return {
      openapi: "3.0.0",
      info: {
        title: "GameGoo API",
        version: "1.0.0",
      },
      paths: {},
      components: {
        securitySchemes: {
          JWT_TOKEN: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    };
  }
}
