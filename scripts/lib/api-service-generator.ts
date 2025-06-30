import fs from "fs-extra";
import path from "node:path";
import chalk from "chalk";
import { SwaggerSchema } from "./types";

interface ApiMethod {
  method: string;
  path: string;
  operationId: string;
  parameters?: any[];
  requestBody?: any;
  responses: any;
  tags?: string[];
}

interface ServiceFunction {
  name: string;
  method: string;
  path: string;
  parameters: string[];
  requestType?: string;
  responseType: string;
  hasAuth: boolean;
}

export class ApiServiceGenerator {
  private schema: SwaggerSchema;
  private outputDir: string;

  constructor(schemaPath: string, outputDir: string) {
    const content = fs.readFileSync(schemaPath, "utf8");
    this.schema = JSON.parse(content);
    this.outputDir = outputDir;
  }

  async generate(): Promise<void> {
    const apiMethods = this.extractApiMethods();
    const servicesByDomain = this.groupServicesByDomain(apiMethods);

    // Create api directory
    const apiDir = path.join(this.outputDir, "api");
    await fs.ensureDir(apiDir);

    // Generate service files for each domain
    for (const [domain, services] of Array.from(servicesByDomain.entries())) {
      await this.generateDomainService(apiDir, domain, services);
    }

    // Generate index file
    await this.generateApiIndex(apiDir, Array.from(servicesByDomain.keys()));

    console.info("✅ API service functions generated");
  }

  private extractApiMethods(): ApiMethod[] {
    const methods: ApiMethod[] = [];

    if (!this.schema.paths) return methods;

    Object.entries(this.schema.paths).forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
        if (["get", "post", "put", "delete", "patch"].includes(method)) {
          methods.push({
            method: method.toUpperCase(),
            path,
            operationId:
              operation.operationId ||
              `${method}${path.replace(/[^a-zA-Z0-9]/g, "")}`,
            parameters: operation.parameters,
            requestBody: operation.requestBody,
            responses: operation.responses,
            tags: operation.tags,
          });
        }
      });
    });

    return methods;
  }

  private groupServicesByDomain(
    methods: ApiMethod[]
  ): Map<string, ServiceFunction[]> {
    const domainMap = new Map<string, ServiceFunction[]>();

    methods.forEach((method) => {
      const domain = this.extractDomain(method);
      const serviceFunction = this.createServiceFunction(method);

      const functions = domainMap.get(domain) || [];
      functions.push(serviceFunction);
      domainMap.set(domain, functions);
    });

    return domainMap;
  }

  private extractDomain(method: ApiMethod): string {
    // Extract domain from tags first
    if (method.tags && method.tags.length > 0) {
      return method.tags[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    // Extract from path
    const pathParts = method.path
      .split("/")
      .filter((part) => part && !part.startsWith("{"));
    if (pathParts.length > 2) {
      return pathParts[2]; // /api/v2/posts -> posts
    }

    return "common";
  }

  private createServiceFunction(method: ApiMethod): ServiceFunction {
    const functionName = this.generateFunctionName(method);
    const parameters = this.extractParameters(method);
    const responseType = this.extractResponseType(method);
    const requestType = this.extractRequestType(method);
    const hasAuth = this.requiresAuth(method);

    return {
      name: functionName,
      method: method.method,
      path: method.path,
      parameters,
      requestType,
      responseType,
      hasAuth,
    };
  }

  private generateFunctionName(method: ApiMethod): string {
    // api/v2 제거하고 실제 경로 추출
    const cleanPath = method.path.replace(/^\/api\/v[0-9]+\//, "");
    const pathSegments = cleanPath.split("/").filter((part) => part);

    // HTTP 메서드 매핑
    const methodMap: Record<string, string> = {
      GET: "get",
      POST: "post",
      PUT: "put",
      DELETE: "delete",
      PATCH: "patch",
    };

    const httpMethod = methodMap[method.method] || method.method.toLowerCase();

    // 경로 세그먼트들을 camelCase로 조합
    if (pathSegments.length === 0) {
      return httpMethod;
    }

    // 경로 세그먼트들을 조합하여 함수명 생성 (파라미터 포함)
    const pathParts = pathSegments.map((segment) => {
      if (segment.startsWith("{") && segment.endsWith("}")) {
        // {memberId} -> MemberId
        const paramName = segment.slice(1, -1);
        return this.pascalCase(paramName);
      }
      return this.pascalCase(segment);
    });

    const functionName = httpMethod + pathParts.join("");

    return this.camelCase(functionName);
  }

  private getSingularForm(word: string): string {
    // 복수형을 단수형으로 변환
    const singularMap: Record<string, string> = {
      posts: "board",
      users: "user",
      friends: "friend",
      notifications: "notification",
      reports: "report",
      chats: "chat",
      members: "member",
    };

    if (singularMap[word]) {
      return singularMap[word];
    }

    // 기본 복수형 처리
    if (word.endsWith("s") && word.length > 1) {
      return word.slice(0, -1);
    }

    return word;
  }

  private extractParameters(method: ApiMethod): string[] {
    const params: string[] = [];

    // Path parameters
    const pathParams = method.path.match(/\{([^}]+)\}/g);
    if (pathParams) {
      pathParams.forEach((param) => {
        const paramName = param.slice(1, -1);
        params.push(`${paramName}: number | string`);
      });
    }

    // Query parameters
    if (method.parameters) {
      method.parameters.forEach((param) => {
        if (param.in === "query") {
          const type = this.getParameterType(param.schema);
          const optional = param.required ? "" : "?";
          params.push(`${param.name}${optional}: ${type}`);
        }
      });
    }

    // Request body
    if (method.requestBody && method.method !== "GET") {
      const requestType = this.extractRequestType(method);
      if (requestType) {
        params.push(`data: ${requestType}`);
      }
    }

    return params;
  }

  private extractRequestType(method: ApiMethod): string | undefined {
    if (!method.requestBody) return undefined;

    const content = method.requestBody.content;
    if (content && content["application/json"]) {
      const schema = content["application/json"].schema;
      if (schema && schema.$ref) {
        return this.extractTypeFromRef(schema.$ref);
      }
    }

    return undefined;
  }

  private extractResponseType(method: ApiMethod): string {
    const response200 = method.responses["200"] || method.responses["201"];
    if (!response200) return "any";

    const content = response200.content;
    if (content && content["*/*"]) {
      const schema = content["*/*"].schema;
      if (schema && schema.$ref) {
        const typeName = this.extractTypeFromRef(schema.$ref);
        // ApiResponse 래퍼 타입인 경우 실제 데이터 타입 추출
        if (typeName.startsWith("ApiResponse")) {
          return `ApiResponse<${this.extractDataTypeFromApiResponse(typeName)}>`;
        }
        return typeName;
      }
    }

    // application/json도 체크
    if (content && content["application/json"]) {
      const schema = content["application/json"].schema;
      if (schema && schema.$ref) {
        const typeName = this.extractTypeFromRef(schema.$ref);
        if (typeName.startsWith("ApiResponse")) {
          return `ApiResponse<${this.extractDataTypeFromApiResponse(typeName)}>`;
        }
        return typeName;
      }
    }

    return "any";
  }

  private extractDataTypeFromApiResponse(apiResponseType: string): string {
    // ApiResponseBoardInsertResponse -> BoardInsertResponse
    // ApiResponseString -> string
    // ApiResponseInteger -> number
    // ApiResponseListString -> string[]
    const match = apiResponseType.match(/^ApiResponse(.+)$/);
    if (!match) return "any";

    const dataType = match[1];

    // 기본 타입들 매핑
    const primitiveMap: Record<string, string> = {
      String: "string",
      Integer: "number",
      Boolean: "boolean",
      Object: "any",
      ListString: "string[]",
      ListLong: "number[]",
      ListInteger: "number[]",
    };

    if (primitiveMap[dataType]) {
      return primitiveMap[dataType];
    }

    // List로 시작하는 타입들을 배열로 변환
    // ListFriendInfoResponse -> FriendInfoResponse[]
    // ListReportListResponse -> ReportListResponse[]
    if (dataType.startsWith("List")) {
      const baseType = dataType.substring(4); // 'List' 제거
      return `${baseType}[]`;
    }

    // 복합 타입은 그대로 반환
    return dataType;
  }

  private extractTypeFromRef(ref: string): string {
    const typeName = ref.split("/").pop();
    if (!typeName) return "any";

    // Convert to PascalCase
    return this.pascalCase(typeName);
  }

  private requiresAuth(method: ApiMethod): boolean {
    // Check if method has security requirements
    if (method.responses["401"] || method.responses["403"]) {
      return true;
    }

    // Check path patterns that typically require auth
    const authPaths = [
      "/posts",
      "/profile",
      "/friend",
      "/chat",
      "/block",
      "/manner",
    ];
    return authPaths.some((authPath) => method.path.includes(authPath));
  }

  private getParameterType(schema: any): string {
    if (!schema) return "any";

    switch (schema.type) {
      case "string":
        return "string";
      case "number":
      case "integer":
        return "number";
      case "boolean":
        return "boolean";
      case "array":
        return `${this.getParameterType(schema.items)}[]`;
      default:
        return "any";
    }
  }

  private async generateDomainService(
    apiDir: string,
    domain: string,
    services: ServiceFunction[]
  ): Promise<void> {
    const serviceFile = path.join(apiDir, `${domain}.ts`);

    const imports = this.generateImports(services);
    const functions = services
      .map((service) => this.generateServiceFunction(service))
      .join("\n\n");

    const content = `${imports}\n\n${functions}\n`;

    await fs.writeFile(serviceFile, content);
    console.info(chalk.gray(`  ✓ Generated ${domain}.ts service`));
  }

  private generateImports(services: ServiceFunction[]): string {
    const types = new Set<string>();
    const hasAuth = services.some((s) => s.hasAuth);
    const hasNonAuth = services.some((s) => !s.hasAuth);
    let needsApiResponse = false;

    // 기본 TypeScript 타입들 (import하지 않음)
    const builtInTypes = new Set([
      "string",
      "number",
      "boolean",
      "any",
      "void",
      "unknown",
      "string[]",
      "number[]",
      "boolean[]",
      "any[]",
    ]);

    // 배열 타입에서 기본 타입을 추출하는 헬퍼 함수
    const extractBaseType = (typeStr: string): string => {
      if (typeStr.endsWith("[]")) {
        return typeStr.slice(0, -2);
      }
      return typeStr;
    };

    services.forEach((service) => {
      if (service.requestType && !builtInTypes.has(service.requestType)) {
        const baseType = extractBaseType(service.requestType);
        if (!builtInTypes.has(baseType)) {
          types.add(baseType);
        }
      }

      // ApiResponse<T> 패턴 처리
      if (service.responseType.includes("ApiResponse<")) {
        needsApiResponse = true;
        // ApiResponse<BoardInsertResponse> -> BoardInsertResponse 추출
        const match = service.responseType.match(/ApiResponse<(.+)>/);
        if (match && !builtInTypes.has(match[1])) {
          const baseType = extractBaseType(match[1]);
          if (!builtInTypes.has(baseType)) {
            types.add(baseType);
          }
        }
      } else if (
        service.responseType !== "any" &&
        !builtInTypes.has(service.responseType)
      ) {
        const baseType = extractBaseType(service.responseType);
        if (!builtInTypes.has(baseType)) {
          types.add(baseType);
        }
      }
    });

    const typeImports = Array.from(types);
    if (needsApiResponse) {
      typeImports.unshift("ApiResponse");
    }

    const imports: string[] = [];

    if (typeImports.length > 0) {
      imports.push(`import type { ${typeImports.join(", ")} } from '../types'`);
    }

    if (hasAuth) {
      imports.push(`import { AuthAxios } from '@/api/auth'`);
    }

    if (hasNonAuth) {
      imports.push(`import Axios from '@/api'`);
    }

    return imports.join("\n");
  }

  private generateServiceFunction(service: ServiceFunction): string {
    const {
      name,
      method,
      path,
      parameters,
      requestType,
      responseType,
      hasAuth,
    } = service;

    const axiosInstance = hasAuth ? "AuthAxios" : "Axios";
    const methodLower = method.toLowerCase();

    // Build function signature
    const paramString = parameters.length > 0 ? parameters.join(", ") : "";
    const functionSignature = `export const ${name} = async (${paramString}): Promise<${responseType}> => {`;

    // Build endpoint URL
    const endpointUrl = this.buildEndpointUrl(path, parameters);

    // Build axios call
    let axiosCall = "";
    if (method === "GET") {
      const queryParams = this.extractQueryParams(parameters);
      if (queryParams.length > 0) {
        axiosCall = `const response = await ${axiosInstance}.${methodLower}(endpoint, { params: { ${queryParams.join(
          ", "
        )} } })`;
      } else {
        axiosCall = `const response = await ${axiosInstance}.${methodLower}(endpoint)`;
      }
    } else if (requestType) {
      axiosCall = `const response = await ${axiosInstance}.${methodLower}(endpoint, data)`;
    } else {
      axiosCall = `const response = await ${axiosInstance}.${methodLower}(endpoint)`;
    }

    return `/* ${this.generateComment(name, method)} */
${functionSignature}
  const endpoint = ${endpointUrl}
  try {
    ${axiosCall}
    return response.data
  } catch (error) {
    console.error('${name} failed:', error)
    throw error
  }
}`;
  }

  private buildEndpointUrl(path: string, parameters: string[]): string {
    const pathParams = path.match(/\{([^}]+)\}/g);
    let endpoint = path;

    if (pathParams) {
      pathParams.forEach((param) => {
        const paramName = param.slice(1, -1);
        endpoint = endpoint.replace(param, `\${${paramName}}`);
      });
      return `\`${endpoint}\``;
    }

    return `'${endpoint}'`;
  }

  private extractQueryParams(parameters: string[]): string[] {
    return parameters
      .filter((param) => !param.includes(":") || param.includes("?:"))
      .map((param) => param.split(":")[0].replace("?", ""));
  }

  private generateComment(functionName: string, method: string): string {
    const actionMap: Record<string, string> = {
      GET: "조회",
      POST: "생성",
      PUT: "수정",
      DELETE: "삭제",
      PATCH: "업데이트",
    };

    return `${functionName} - ${actionMap[method] || method}`;
  }

  private async generateApiIndex(
    apiDir: string,
    domains: string[]
  ): Promise<void> {
    const exports = domains
      .sort()
      .map((domain) => `export * from './${domain}'`)
      .join("\n");

    await fs.writeFile(path.join(apiDir, "index.ts"), exports + "\n");
    console.info(chalk.gray("  ✓ Generated api/index.ts"));
  }

  private camelCase(str: string): string {
    return str
      .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
      .replace(/^./, (char) => char.toLowerCase());
  }

  private pascalCase(str: string): string {
    return str
      .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
      .replace(/^./, (char) => char.toUpperCase());
  }
}
