#!/usr/bin/env node

/**
 * This script generates a TypeScript file with embedded component source code
 * to be imported by the DemoComponentService
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define paths for monorepo structure
const rootDir = process.cwd();
const sourcePath = path.resolve(rootDir, 'apps/docs/src/app/components/demo');
const outputFile = path.resolve(
  rootDir,
  'apps/docs/src/app/components/demo/component-sources.ts'
);

console.log('Starting component source file generation...');
console.log(`Source path: ${sourcePath}`);
console.log(`Output file: ${outputFile}`);

// Find all component files
console.log('Finding component files...');
const componentFiles = glob.sync(`${sourcePath}/*.component.ts`);
console.log(`Found ${componentFiles.length} component files`);

/**
 * Convert kebab-case to camelCase
 * @param {string} text Text to convert
 * @returns {string} Converted text
 */
function kebabToCamelCase(text) {
  return text.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Generate source map object
const componentSources = {};

componentFiles.forEach((filePath) => {
  const fileName = path.basename(filePath);
  const kebabComponentName = fileName.replace('.component.ts', '');
  const componentName = kebabToCamelCase(kebabComponentName);

  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Escape backticks, backslashes, dollar signs, etc.
    content = content
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');

    componentSources[componentName] = content;
    console.log(
      `✓ Processed component source: ${kebabComponentName} -> ${componentName}`
    );
  } catch (error) {
    console.error(
      `✗ Failed to process ${kebabComponentName}: ${error.message}`
    );
  }
});

// Generate TypeScript file
let tsCode = `/**
 * GENERATED FILE - DO NOT EDIT
 * This file contains component source code for the demo components
 * Generated on: ${new Date().toISOString()}
 */

export const componentSources: Record<string, string> = {\n`;

Object.keys(componentSources).forEach((componentName) => {
  tsCode += `  '${componentName}': \`${componentSources[componentName]}\`,\n`;
});

tsCode += `};\n`;

// Write output file
try {
  fs.writeFileSync(outputFile, tsCode, 'utf-8');
  console.log(`✓ Generated component sources file: ${outputFile}`);
  console.log('Component source file generation complete!');
} catch (error) {
  console.error(`✗ Failed to write output file: ${error.message}`);
  process.exit(1);
}
