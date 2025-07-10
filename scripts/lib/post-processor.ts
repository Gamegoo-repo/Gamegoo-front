import path from "node:path";
import chalk from "chalk";
import fs from "fs-extra";

interface DomainGroup {
  domain: string;
  files: string[];
}

export class PostProcessor {
  constructor(private outputDir: string) {}

  async process(): Promise<void> {
    await this.processApiIndex();
    await this.reorganizeTypesByDomain();
    await this.processTypeIndex();
    await this.extractCommonEnums();
  }

  private async processApiIndex(): Promise<void> {
    const apiIndexPath = path.join(this.outputDir, "apis", "index.ts");

    if (await fs.pathExists(apiIndexPath)) {
      let content = await fs.readFile(apiIndexPath, "utf8");
      content = content.replace(
        /export \* from ['"]\.\//g,
        'export * from "./'
      );
      await fs.writeFile(apiIndexPath, content);
      console.info("✅ API index file processed");
    }
  }

  private async processTypeIndex(): Promise<void> {
    // ApiResponse를 제네릭 타입으로 수정
    await this.updateApiResponseToGeneric();
    console.info("✅ Type index file processed");
  }

  private async updateApiResponseToGeneric(): Promise<void> {
    const apiFilePath = path.join(this.outputDir, "types", "common", "api.ts");

    if (await fs.pathExists(apiFilePath)) {
      let content = await fs.readFile(apiFilePath, "utf8");

      // ApiResponse 인터페이스를 제네릭으로 변경
      if (content.includes("export interface ApiResponse {")) {
        // 제네릭 타입 파라미터 추가
        content = content.replace(
          "export interface ApiResponse {",
          "export interface ApiResponse<T = any> {"
        );

        // data 필드의 타입을 any에서 T로 변경
        content = content.replace("'data'?: any;", "'data'?: T;");

        // 타입 주석도 업데이트
        content = content.replace("* @type {any}", "* @type {T}");

        await fs.writeFile(apiFilePath, content);
        console.info("✅ Updated ApiResponse to generic type: ApiResponse<T>");
      }
    }
  }

  private async reorganizeTypesByDomain(): Promise<void> {
    console.info("📁 Reorganizing types by domain...");

    const typesDir = path.join(this.outputDir, "types");
    const files = await fs.readdir(typesDir);

    // Filter out api-response wrapper files and get actual type files
    const typeFiles = files.filter(
      (file) =>
        file.endsWith(".ts") &&
        file !== "index.ts" &&
        !file.startsWith("api-response-")
    );

    // Group files by domain (first part before hyphen)
    const domainGroups = this.groupFilesByDomain(typeFiles);

    // Merge request/response pairs and move files to domain folders
    const mergedFileInfo = await this.mergeAndMoveFiles(typesDir, domainGroups);

    // Create domain index files with merged file info
    await this.createDomainIndexFiles(typesDir, mergedFileInfo);

    // Update main index file
    await this.updateMainIndexFile(typesDir, mergedFileInfo);

    // Update import paths in all files
    await this.updateImportPaths(typesDir, mergedFileInfo);

    // Clean up old files
    await this.cleanupOldFiles(typesDir, typeFiles);

    console.info("✅ Type reorganization completed");
  }

  private groupFilesByDomain(files: string[]): DomainGroup[] {
    const domainMap = new Map<string, string[]>();

    files.forEach((file) => {
      const baseName = file.replace(".ts", "");
      const parts = baseName.split("-");

      // Special handling for common types
      if (baseName === "api-response" || baseName === "priority-value") {
        domainMap.set("common", [...(domainMap.get("common") || []), file]);
        return;
      }

      // Extract domain from first part
      let domain = parts[0];

      // Handle special cases
      if (domain === "my" && parts[1]) {
        // 'my-board-*' -> 'board' domain
        domain = parts[1];
      } else if (domain === "system" && parts[1] === "flag") {
        // 'system-flag-*' -> 'user' domain
        domain = "user";
      } else if (domain === "initializing" && parts[1] === "matching") {
        // 'initializing-matching-*' -> 'matching' domain
        domain = "matching";
      } else if (domain === "priority" || domain === "champion") {
        // Champion related files
        domain = "champion";
      }

      const fileList = domainMap.get(domain) || [];
      fileList.push(file);
      domainMap.set(domain, fileList);
    });

    // Convert map to array and sort
    return Array.from(domainMap.entries())
      .map(([domain, files]) => ({ domain, files }))
      .sort((a, b) => a.domain.localeCompare(b.domain));
  }

  private async mergeAndMoveFiles(
    typesDir: string,
    domainGroups: DomainGroup[]
  ): Promise<Map<string, string[]>> {
    const processedFiles = new Set<string>();
    const domainFileMap = new Map<string, string[]>();

    for (const { domain, files } of domainGroups) {
      const domainDir = path.join(typesDir, domain);
      await fs.ensureDir(domainDir);

      const domainFiles: string[] = [];

      // Group files by base name (without -request/-response suffix)
      const fileGroups = new Map<
        string,
        { request?: string; response?: string; others: string[] }
      >();

      for (const file of files) {
        if (processedFiles.has(file)) continue;

        const baseName = file
          .replace(".ts", "")
          .replace(/-request$/, "")
          .replace(/-response$/, "");

        const group = fileGroups.get(baseName) || { others: [] };

        if (file.endsWith("-request.ts")) {
          group.request = file;
        } else if (file.endsWith("-response.ts")) {
          group.response = file;
        } else {
          group.others.push(file);
        }

        fileGroups.set(baseName, group);
      }

      // Process each file group
      for (const [baseName, group] of Array.from(fileGroups.entries())) {
        if (group.request && group.response) {
          // Merge request and response into single file
          await this.mergeRequestResponse(
            typesDir,
            domainDir,
            baseName,
            group.request,
            group.response
          );
          processedFiles.add(group.request);
          processedFiles.add(group.response);
          domainFiles.push(`${baseName}.ts`);
        } else {
          // Process individual files
          if (group.request) {
            await this.processSingleFile(
              typesDir,
              domainDir,
              baseName,
              group.request,
              "request"
            );
            processedFiles.add(group.request);
            domainFiles.push(`${baseName}.ts`);
          }
          if (group.response) {
            await this.processSingleFile(
              typesDir,
              domainDir,
              baseName,
              group.response,
              "response"
            );
            processedFiles.add(group.response);
            domainFiles.push(`${baseName}.ts`);
          }
          // Copy other files as-is
          for (const file of group.others) {
            await fs.move(
              path.join(typesDir, file),
              path.join(domainDir, file),
              { overwrite: true }
            );
            processedFiles.add(file);
            domainFiles.push(file);
          }
        }
      }

      domainFileMap.set(domain, domainFiles);
    }

    return domainFileMap;
  }

  private async mergeRequestResponse(
    typesDir: string,
    domainDir: string,
    baseName: string,
    requestFile: string,
    responseFile: string
  ): Promise<void> {
    const requestPath = path.join(typesDir, requestFile);
    const responsePath = path.join(typesDir, responseFile);
    const targetPath = path.join(domainDir, `${baseName}.ts`);

    // Read both files
    const requestContent = await fs.readFile(requestPath, "utf8");
    const responseContent = await fs.readFile(responsePath, "utf8");

    // Extract imports and content
    const requestImports = this.extractImports(requestContent);
    const responseImports = this.extractImports(responseContent);
    const requestBody = this.removeImports(requestContent);
    const responseBody = this.removeImports(responseContent);

    // Merge imports (remove duplicates)
    const allImports = new Set([...requestImports, ...responseImports]);

    // Create merged content
    const mergedContent = [
      ...Array.from(allImports),
      "",
      "// Request types",
      requestBody.trim(),
      "",
      "// Response types",
      responseBody.trim(),
      "",
    ].join("\n");

    await fs.writeFile(targetPath, mergedContent);
    console.info(
      chalk.gray(
        `  ✓ Merged ${requestFile} + ${responseFile} → ${domainDir}/${baseName}.ts`
      )
    );

    // Remove original files
    await fs.remove(requestPath);
    await fs.remove(responsePath);
  }

  private async processSingleFile(
    typesDir: string,
    domainDir: string,
    baseName: string,
    file: string,
    type: "request" | "response"
  ): Promise<void> {
    const sourcePath = path.join(typesDir, file);
    const targetPath = path.join(domainDir, `${baseName}.ts`);

    let content = await fs.readFile(sourcePath, "utf8");

    // Add comment to indicate type
    const imports = this.extractImports(content);
    const body = this.removeImports(content);

    content = [
      ...imports,
      "",
      `// ${type.charAt(0).toUpperCase() + type.slice(1)} types`,
      body.trim(),
      "",
    ].join("\n");

    await fs.writeFile(targetPath, content);
    await fs.remove(sourcePath);

    console.info(chalk.gray(`  ✓ ${file} → ${domainDir}/${baseName}.ts`));
  }

  private extractImports(content: string): string[] {
    const lines = content.split("\n");
    const imports: string[] = [];

    for (const line of lines) {
      if (
        line.trim().startsWith("import") ||
        line.trim().startsWith("export * from") ||
        line.trim().startsWith("export {")
      ) {
        imports.push(line);
      } else if (line.trim() && !line.trim().startsWith("//")) {
        // Stop at first non-import, non-comment line
        break;
      }
    }

    return imports;
  }

  private removeImports(content: string): string {
    const lines = content.split("\n");
    let startIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (
        line &&
        !line.startsWith("import") &&
        !line.startsWith("export * from") &&
        !line.startsWith("export {") &&
        !line.startsWith("//")
      ) {
        startIndex = i;
        break;
      }
    }

    return lines.slice(startIndex).join("\n");
  }

  private async createDomainIndexFiles(
    typesDir: string,
    domainFileMap: Map<string, string[]>
  ): Promise<void> {
    for (const [domain, files] of Array.from(domainFileMap.entries())) {
      const domainDir = path.join(typesDir, domain);
      const indexPath = path.join(domainDir, "index.ts");

      // Remove duplicates and sort
      const uniqueFiles = Array.from(new Set(files));

      const exports = uniqueFiles
        .map((file) => file.replace(".ts", ""))
        .map((name) => `export * from './${name}'`)
        .sort();

      await fs.writeFile(indexPath, exports.join("\n") + "\n");
      console.info(chalk.gray(`  ✓ Created ${domain}/index.ts`));
    }
  }

  private async updateMainIndexFile(
    typesDir: string,
    domainFileMap: Map<string, string[]>
  ): Promise<void> {
    const domains = Array.from(domainFileMap.keys()).sort();

    const exports = [
      "// Auto-generated domain exports",
      ...domains.map((domain) => `export * from './${domain}'`),
    ];

    await fs.writeFile(
      path.join(typesDir, "index.ts"),
      exports.join("\n") + "\n"
    );
  }

  private async updateImportPaths(
    typesDir: string,
    domainFileMap: Map<string, string[]>
  ): Promise<void> {
    // Update all files in domain directories
    for (const [domain] of Array.from(domainFileMap.entries())) {
      const domainDir = path.join(typesDir, domain);
      if (await fs.pathExists(domainDir)) {
        await this.updateImportsInDirectory(domainDir);
      }
    }

    console.info(chalk.gray("  ✓ Updated import paths"));
  }

  private async updateImportsInDirectory(dir: string): Promise<void> {
    const files = await fs.readdir(dir);

    for (const file of files) {
      if (file.endsWith(".ts") && file !== "index.ts") {
        const filePath = path.join(dir, file);
        await this.updateImportsInFile(filePath);
      }
    }
  }

  private async updateImportsInFile(filePath: string): Promise<void> {
    let content = await fs.readFile(filePath, "utf8");
    let hasChanges = false;

    // Remove -response or -request suffixes from import paths
    const importRegex = /from ["']\.\/([^"']+)(-response|-request)["']/g;
    const matches = content.match(importRegex);

    if (matches) {
      for (const match of matches) {
        const importMatch = match.match(
          /from ["']\.\/([^"']+)(-response|-request)["']/
        );
        if (importMatch) {
          const [fullMatch, baseName, suffix] = importMatch;
          // Find the correct domain and path
          const newPath = await this.findCorrectImportPath(baseName, filePath);
          if (newPath) {
            const newImport = `from "${newPath}"`;
            content = content.replace(fullMatch, newImport);
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      await fs.writeFile(filePath, content);
    }
  }

  private async findCorrectImportPath(
    baseName: string,
    currentFilePath: string
  ): Promise<string | null> {
    const currentDir = path.dirname(currentFilePath);
    const typesDir = path.join(this.outputDir, "types");

    // Common mappings for known files
    const commonMappings: Record<string, string> = {
      "champion-stats": "../champion/champion-stats",
      "game-style": "../game/game-style",
    };

    if (commonMappings[baseName]) {
      return commonMappings[baseName];
    }

    // Try to find the file in other domains
    const domains = await fs.readdir(typesDir);
    for (const domain of domains) {
      const domainPath = path.join(typesDir, domain);
      if ((await fs.stat(domainPath)).isDirectory()) {
        const targetFile = path.join(domainPath, `${baseName}.ts`);
        if (await fs.pathExists(targetFile)) {
          return `../${domain}/${baseName}`;
        }
      }
    }

    return null;
  }

  private async cleanupOldFiles(
    typesDir: string,
    movedFiles: string[]
  ): Promise<void> {
    // Remove api-response wrapper files
    const files = await fs.readdir(typesDir);
    const wrapperFiles = files.filter(
      (file) =>
        file.startsWith("api-response-") &&
        file.endsWith(".ts") &&
        file !== "api-response.ts"
    );

    for (const file of wrapperFiles) {
      await fs.remove(path.join(typesDir, file));
    }

    console.info(
      chalk.gray(`  ✓ Removed ${wrapperFiles.length} wrapper files`)
    );
  }

  private async extractCommonEnums(): Promise<void> {
    console.info("🔧 Extracting common enums...");

    const typesDir = path.join(this.outputDir, "types");
    const enumMap = new Map<string, { definition: string; files: string[] }>();

    // 모든 타입 파일에서 enum 수집
    await this.collectEnumsFromDirectory(typesDir, enumMap);

    // 중복되는 enum들을 찾아서 공통 파일로 분리
    const commonEnums = this.findCommonEnums(enumMap);

    if (commonEnums.size > 0) {
      // 공통 enum 파일 생성
      await this.createCommonEnumFile(typesDir, commonEnums);

      // 각 파일에서 중복 enum 제거 및 import 추가
      await this.removeEnumsFromFiles(typesDir, commonEnums);

      console.info(
        chalk.gray(`  ✓ Extracted ${commonEnums.size} common enums`)
      );
    }
  }

  private async collectEnumsFromDirectory(
    dir: string,
    enumMap: Map<string, { definition: string; files: string[] }>
  ): Promise<void> {
    const items = await fs.readdir(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory()) {
        await this.collectEnumsFromDirectory(itemPath, enumMap);
      } else if (item.endsWith(".ts") && item !== "index.ts") {
        await this.collectEnumsFromFile(itemPath, enumMap);
      }
    }
  }

  private async collectEnumsFromFile(
    filePath: string,
    enumMap: Map<string, { definition: string; files: string[] }>
  ): Promise<void> {
    const content = await fs.readFile(filePath, "utf8");
    const enumRegex = /export enum (\w+) \{[^}]+\}/g;
    let match;

    while ((match = enumRegex.exec(content)) !== null) {
      const enumName = match[1];
      const enumDefinition = match[0];

      if (enumMap.has(enumName)) {
        const existing = enumMap.get(enumName)!;
        if (existing.definition === enumDefinition) {
          existing.files.push(filePath);
        }
      } else {
        enumMap.set(enumName, {
          definition: enumDefinition,
          files: [filePath],
        });
      }
    }
  }

  private findCommonEnums(
    enumMap: Map<string, { definition: string; files: string[] }>
  ): Map<string, string> {
    const commonEnums = new Map<string, string>();

    for (const [enumName, { definition, files }] of Array.from(
      enumMap.entries()
    )) {
      // 2개 이상의 파일에서 사용되는 enum을 공통으로 분류
      if (files.length > 1) {
        commonEnums.set(enumName, definition);
      }
    }

    return commonEnums;
  }

  private async createCommonEnumFile(
    typesDir: string,
    commonEnums: Map<string, string>
  ): Promise<void> {
    const enumsDir = path.join(typesDir, "common");
    await fs.ensureDir(enumsDir);

    const enumsFilePath = path.join(enumsDir, "enums.ts");

    const content = [
      "/* tslint:disable */",
      "/* eslint-disable */",
      "/**",
      " * Common enums used across multiple domains",
      " * Auto-generated - do not edit manually",
      " */",
      "",
      ...Array.from(commonEnums.values()),
      "",
    ].join("\n");

    await fs.writeFile(enumsFilePath, content);

    // common/index.ts 업데이트
    const commonIndexPath = path.join(enumsDir, "index.ts");
    let indexContent = await fs.readFile(commonIndexPath, "utf8");
    indexContent += "export * from './enums'\n";
    await fs.writeFile(commonIndexPath, indexContent);
  }

  private async removeEnumsFromFiles(
    typesDir: string,
    commonEnums: Map<string, string>
  ): Promise<void> {
    const enumNames = Array.from(commonEnums.keys());
    const enumNamesSet = new Set(enumNames);

    await this.removeEnumsFromDirectory(typesDir, enumNamesSet);
  }

  private async removeEnumsFromDirectory(
    dir: string,
    enumNames: Set<string>
  ): Promise<void> {
    const items = await fs.readdir(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory() && item !== "common") {
        await this.removeEnumsFromDirectory(itemPath, enumNames);
      } else if (item.endsWith(".ts") && item !== "index.ts") {
        await this.removeEnumsFromFile(itemPath, enumNames);
      }
    }
  }

  private async removeEnumsFromFile(
    filePath: string,
    enumNames: Set<string>
  ): Promise<void> {
    let content = await fs.readFile(filePath, "utf8");
    let hasChanges = false;
    let needsImport = false;

    // enum 정의 제거
    for (const enumName of Array.from(enumNames)) {
      const enumRegex = new RegExp(
        `export enum ${enumName} \\{[^}]+\\}\\s*`,
        "g"
      );
      if (enumRegex.test(content)) {
        content = content.replace(enumRegex, "");
        hasChanges = true;
        needsImport = true;
      }
    }

    // import 추가
    if (needsImport && !content.includes("from '../common'")) {
      const importLine = `import { ${Array.from(enumNames)
        .filter((name) => content.includes(name))
        .join(", ")} } from '../common'\n`;

      // 기존 import 문 뒤에 추가
      const importInsertIndex = content.lastIndexOf("import ");
      if (importInsertIndex !== -1) {
        const nextNewline = content.indexOf("\n", importInsertIndex);
        content =
          content.slice(0, nextNewline + 1) +
          importLine +
          content.slice(nextNewline + 1);
      } else {
        // import가 없으면 파일 맨 앞에 추가
        content = importLine + "\n" + content;
      }
      hasChanges = true;
    }

    if (hasChanges) {
      await fs.writeFile(filePath, content);
    }
  }
}
