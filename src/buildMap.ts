#!/usr/bin/env bun

import { promises as fs } from "node:fs";
import path from "node:path";

// Correctly determine the project root directory
const projectRoot = process.cwd(); // This should point to the root of your project
const pagesDirectory = path.join(projectRoot, "src", "pages");
const outputDir = path.join(projectRoot, ".bext"); // Output directory within project root
const outputFile = path.join(outputDir, "ComponentMap.ts");

// Ensure .bext directory exists
(async () => {
  await fs.mkdir(outputDir, { recursive: true });
})();

const maxDepth = 5; // Default max depth

async function getFiles(
  dir: string,
  currentDepth: number = 0
): Promise<string[]> {
  if (currentDepth > maxDepth) return [];
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res, currentDepth + 1) : res;
    })
  );
  return Array.prototype.concat(...files);
}

async function buildComponentMap() {
  const files = await getFiles(pagesDirectory);
  const imports: string[] = [];
  const mappings: string[] = [];
  const componentNameCounts: Record<string, number> = {}; // Track occurrences of component names

  files.forEach((file) => {
    if (path.basename(file) !== "page.tsx") {
      return; // Skip files that are not page.tsx
    }
    const relativePath = path.relative(pagesDirectory, file);
    const importPath = `../src/pages/${relativePath
      .replace(/\\/g, "/")
      .replace(/page\.tsx$/, "")}page`;

    let baseComponentName =
      relativePath.split(path.sep).slice(-2, -1)[0] || "Home";
    baseComponentName =
      baseComponentName.charAt(0).toUpperCase() + baseComponentName.slice(1);

    const componentNameCount = componentNameCounts[baseComponentName] || 0;
    componentNameCounts[baseComponentName] = componentNameCount + 1;
    const componentName =
      componentNameCount > 0
        ? `${baseComponentName}${componentNameCount}`
        : baseComponentName;

    const routePath =
      "/" +
      relativePath
        .replace(/\\/g, "/")
        .replace(/page\.tsx$/, "")
        .replace(/\/$/, "")
        .replace(/^\/?/, "")
        .replace(/home$/, "");

    imports.push(`import ${componentName} from "${importPath}";`);
    mappings.push(`[${componentName}, "${routePath}"],`);
  });

  const content = `
import { html } from "@elysiajs/html";
${imports.join("\n")}

let cachedMap: Map<() => JSX.Element, string> | null = null;
export const getComponentMap = (): Map<() => JSX.Element, string> => {
  if (!cachedMap) {
    cachedMap = new Map([
      ${mappings.join("\n      ")}
    ]);
  }
  return cachedMap;
};

export function getComponentPath(component: () => JSX.Element): string | undefined {
  const componentMap = getComponentMap();
  const path = componentMap.get(component);
  if (path === undefined) {
    console.error(\`Page mapping not found: \${component.name}\`);
    return "/404";
  }
  return path;
}
  `.trim();

  await Bun.write(outputFile, content);
}

buildComponentMap().then(() =>
  console.log("ComponentMap.ts has been generated in the .bext directory.")
);
