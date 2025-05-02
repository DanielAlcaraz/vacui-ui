#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Helpers to resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directories
const contentDir = path.join(__dirname, '../src/content/docs');
const outputFile = path.join(__dirname, 'search-index.json');

// Configuration
const CONFIG = {
  fileExtension: '.agx',
  maxContentLength: 250
};

// Main function to build the search index
async function buildSearchIndex() {
  console.log('Building search index...');
  
  const agxFiles = getAgxFiles(contentDir);
  console.log(`Found ${agxFiles.length} files to process in ${contentDir}`);
  
  let searchIndex = [];
  
  // Process each file
  for (const { path: filePath, relativePath } of agxFiles) {
    try {
      console.log(`Processing file: ${filePath}`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      // Extract frontmatter and content
      const { data: metadata, content: fileContent } = matter(fileContents);
      
      // Get the script content
      const scriptMatch = fileContent.match(/<script\s+lang="ts">([\s\S]*?)<\/script>/);
      let scriptContent = scriptMatch ? scriptMatch[1].trim() : '';
      
      // Extract structured data from script section
      const structuredScriptData = extractStructuredDataFromScript(scriptContent);
      
      // Get the template content
      const templateMatch = fileContent.match(/<template\s+lang="md">([\s\S]*?)<\/template>/);
      if (!templateMatch) continue;
      
      const templateContent = templateMatch[1].trim();
      
      // Get the main title from frontmatter
      const mainTitle = metadata.title || path.basename(filePath, CONFIG.fileExtension);
      
      // Extract sections from the markdown content
      const sections = extractSections(templateContent, mainTitle);
      
      // Create URL slug
      const slug = metadata.slug || path.basename(filePath, CONFIG.fileExtension);
      const baseUrl = `/${slug}`;
      
      // First, add the main section as a general entry
      if (sections.length > 0 && sections[0].level === 0) {
        const mainSection = sections[0];
        let plainTextContent = mainSection.content.map(paragraph => cleanContent(paragraph));
        plainTextContent = truncateContent(plainTextContent);
        
        searchIndex.push({
          title: mainTitle,
          url: baseUrl,
          sectionTitle: mainSection.title,
          content: plainTextContent,
          tags: [metadata.group || 'Uncategorized'].filter(Boolean),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      // Then add specific section entries
      for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        let plainTextContent = section.content.map(paragraph => cleanContent(paragraph));
        plainTextContent = truncateContent(plainTextContent);
        
        const sectionSlug = createSlug(section.title);
        
        searchIndex.push({
          title: mainTitle,
          url: `${baseUrl}#${sectionSlug}`,
          sectionTitle: section.title,
          content: plainTextContent,
          tags: [metadata.group || 'Uncategorized'].filter(Boolean),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      // Add script data as separate entries with appropriate section links
      if (structuredScriptData) {
        // Process component structure
        if (structuredScriptData.components && structuredScriptData.components.length > 0) {
          searchIndex.push({
            title: mainTitle,
            url: `${baseUrl}#anatomy`,
            sectionTitle: "Component Structure",
            content: [`Component hierarchy for ${mainTitle}:`, 
                     JSON.stringify(structuredScriptData.components, null, 2)],
            tags: [metadata.group || 'Uncategorized', 'Structure'].filter(Boolean),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        
        // Process props by component
        if (structuredScriptData.props && structuredScriptData.props.length > 0) {
          // Group props by component
          const propsByComponent = {};
          structuredScriptData.props.forEach(prop => {
            const component = prop.component;
            if (!propsByComponent[component]) {
              propsByComponent[component] = [];
            }
            propsByComponent[component].push(prop);
          });
          
          // Create entries for each component's props
          for (const [component, props] of Object.entries(propsByComponent)) {
            // Find the closest section that matches this component
            let targetSection = findSectionForProps(sections, component);
            const sectionUrl = targetSection ? 
              `${baseUrl}#${createSlug(targetSection)}` : 
              `${baseUrl}#input-props`;
            
            const componentTitle = component.replace(/Input$|Output$/, '');
            
            searchIndex.push({
              title: mainTitle,
              url: sectionUrl,
              sectionTitle: `${componentTitle} Properties`,
              content: props.map(prop => 
                `${prop.name}: ${prop.description} (${prop.default || 'no default'})`
              ),
              tags: [metadata.group || 'Uncategorized', 'Props', componentTitle].filter(Boolean),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
        
        // Process features
        if (structuredScriptData.features && structuredScriptData.features.length > 0) {
          searchIndex.push({
            title: mainTitle,
            url: `${baseUrl}#features`,
            sectionTitle: "Features",
            content: structuredScriptData.features,
            tags: [metadata.group || 'Uncategorized', 'Features'].filter(Boolean),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        
        // Process types
        if (structuredScriptData.types && structuredScriptData.types.length > 0) {
          searchIndex.push({
            title: mainTitle,
            url: `${baseUrl}#types-and-interfaces`,
            sectionTitle: "Types and Interfaces",
            content: structuredScriptData.types.map(type => 
              `${type.name}: ${type.values || (type.kind === 'interface' ? 'interface' : 'type')}`
            ),
            tags: [metadata.group || 'Uncategorized', 'Types'].filter(Boolean),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }
  
  // Make sure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the search index to file
  fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));
  console.log(`Search index created with ${searchIndex.length} entries at ${outputFile}`);
  
  return searchIndex;
}

// Helper to find the most appropriate section for props
function findSectionForProps(sections, componentName) {
  // Extract base name without Input/Output suffix
  const baseName = componentName.replace(/Input$|Output$/, '');
  
  // First try: find exact match with component name
  for (const section of sections) {
    if (section.title.toLowerCase().includes(baseName.toLowerCase())) {
      return section.title;
    }
  }
  
  // Second try: find any section with "props" or "properties"
  for (const section of sections) {
    if (section.title.toLowerCase().includes('props') || 
        section.title.toLowerCase().includes('properties')) {
      return section.title;
    }
  }
  
  // Default to 'Input props' section
  return 'Input props';
}

// Function to get all AGX files recursively
function getAgxFiles(dir, base = '', arrayOfFiles = []) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory does not exist: ${dir}`);
    return arrayOfFiles;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const relativePath = path.join(base, item.name);
    if (item.isDirectory()) {
      arrayOfFiles = getAgxFiles(path.join(dir, item.name), relativePath, arrayOfFiles);
    } else if (item.name.endsWith(CONFIG.fileExtension)) {
      arrayOfFiles.push({ 
        path: path.join(dir, item.name), 
        relativePath 
      });
    }
  }
  
  return arrayOfFiles;
}

// Extract structured data from script section for search indexing
function extractStructuredDataFromScript(scriptContent) {
  if (!scriptContent) return null;
  
  const scriptData = {
    components: [],
    props: [],
    features: [],
    types: []
  };
  
  // Look for component structure (especially with !DOCS marker)
  const componentStructureRegex = /\/\/\s*!DOCS\s*\n\s*const\s+componentStructure\s*=\s*({[\s\S]*?});/;
  const compMatch = scriptContent.match(componentStructureRegex) || 
                   scriptContent.match(/const\s+componentStructure\s*=\s*({[\s\S]*?});/);
                   
  if (compMatch) {
    try {
      // Try to extract some meaningful data about the component structure
      const structure = compMatch[1];
      
      // Extract component names from the structure
      const nameMatches = structure.matchAll(/"name":\s*["']([^"']+)["']/g);
      for (const match of nameMatches) {
        scriptData.components.push(match[1]);
      }
      
      // Store the full structure for reference
      scriptData.componentStructure = structure;
    } catch (e) {
      console.error('Error parsing component structure:', e);
    }
  }
  
  // Extract input/output rows that contain props and their descriptions
  const rowsRegex = /const\s+(\w+(?:Input|Output)Rows)\s*=\s*\[([\s\S]*?)\];/g;
  let rowsMatch;
  
  while ((rowsMatch = rowsRegex.exec(scriptContent)) !== null) {
    const rowsName = rowsMatch[1];
    const rowsContent = rowsMatch[2];
    
    // Extract properties using a more flexible approach
    // Find each object entry in the rows content
    const propEntries = rowsContent.split(/},\s*\n/).filter(entry => entry.trim());
    
    for (const entry of propEntries) {
      try {
        // Extract individual fields using safer regex patterns
        const propMatch = entry.match(/prop:\s*['"]([^'"]+)['"]/);
        const defaultMatch = entry.match(/default:\s*['"]([^'"]*)['"]/);
        const descMatch = entry.match(/description:\s*['"]([^'"]+)['"]/);
        
        if (propMatch && descMatch) {
          scriptData.props.push({
            name: propMatch[1],
            default: defaultMatch ? defaultMatch[1] : '',
            description: descMatch[1],
            component: rowsName.replace(/Rows$/, '')
          });
        }
      } catch (error) {
        console.error(`Error parsing property entry: ${error.message}`);
      }
    }
  }
  
  // Extract features list if it exists (common in component documentation)
  const featuresRegex = /const\s+features\s*=\s*\[([\s\S]*?)\];/;
  const featMatch = scriptContent.match(featuresRegex);
  if (featMatch) {
    const featuresContent = featMatch[1];
    const featureMatches = featuresContent.matchAll(/["']([^"']+)["']/g);
    for (const match of featureMatches) {
      scriptData.features.push(match[1]);
    }
  }
  
  // Extract type definitions and interfaces
  const typesRegex = /(export\s+)?type\s+(\w+)\s*=\s*(['"][^'"]+['"](\s*\|\s*['"][^'"]+['"])*);/g;
  let typeMatch;
  while ((typeMatch = typesRegex.exec(scriptContent)) !== null) {
    const typeName = typeMatch[2];
    const typeValues = typeMatch[3];
    scriptData.types.push({
      name: typeName,
      values: typeValues
    });
  }
  
  // Extract interfaces
  const interfaceRegex = /(export\s+)?interface\s+(\w+)\s*{([\s\S]*?)}/g;
  let interfaceMatch;
  while ((interfaceMatch = interfaceRegex.exec(scriptContent)) !== null) {
    const interfaceName = interfaceMatch[2];
    scriptData.types.push({
      name: interfaceName,
      kind: 'interface'
    });
  }
  
  // Filter out empty arrays
  for (const [key, value] of Object.entries(scriptData)) {
    if (Array.isArray(value) && value.length === 0) {
      delete scriptData[key];
    }
  }
  
  return Object.keys(scriptData).length > 0 ? scriptData : null;
}

// Function to extract sections from Markdown content
function extractSections(content, mainTitle) {
  const headingRegex = /^(#+)\s+(.+)$/gm;
  const codeBlockRegex = /```[\s\S]*?```/g;
  const componentRegex = /<docs-[\s\S]*?\/>/g;
  
  // Remove code blocks and specific components from the content
  let cleanedContent = content.replace(codeBlockRegex, '').replace(componentRegex, '');
  
  const sections = [];
  let lastIndex = 0;
  let match;
  let mainContentAdded = false;
  
  // Reset regex lastIndex
  headingRegex.lastIndex = 0;
  
  // First find all headings and their positions
  while ((match = headingRegex.exec(cleanedContent)) !== null) {
    const [_, hashes, title] = match;
    const level = hashes.length;
    const start = match.index;
    
    // Add main content if this is the first heading and there's content before it
    if (!mainContentAdded && start > 0) {
      const mainContent = cleanedContent.substring(0, start).trim();
      if (mainContent) {
        sections.push({
          level: 0,
          title: mainTitle,
          start: 0,
          end: start,
          content: breakContentIntoParagraphs(mainContent)
        });
      }
      mainContentAdded = true;
    }
    
    // Close the previous section if there is one
    if (sections.length > 0) {
      const previousSection = sections[sections.length - 1];
      previousSection.end = start;
      previousSection.content = breakContentIntoParagraphs(
        cleanedContent.substring(previousSection.start + previousSection.titleLength, start).trim()
      );
    }
    
    // Add the new section
    sections.push({
      level,
      title,
      start: match.index,
      titleLength: match[0].length,
      content: []
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add main content if no headings were found
  if (sections.length === 0) {
    sections.push({
      level: 0,
      title: mainTitle,
      start: 0,
      end: cleanedContent.length,
      content: breakContentIntoParagraphs(cleanedContent)
    });
  } else {
    // Close the last section
    const lastSection = sections[sections.length - 1];
    lastSection.end = cleanedContent.length;
    lastSection.content = breakContentIntoParagraphs(
      cleanedContent.substring(lastSection.start + lastSection.titleLength).trim()
    );
  }
  
  return sections.map((section, index) => ({
    id: `section-${index}`,
    level: section.level,
    title: section.title,
    content: section.content
  }));
}

// Split content into paragraphs
function breakContentIntoParagraphs(content) {
  const normalizedContent = content.replace(/\r\n|\r/g, "\n");
  return normalizedContent
    .split(/\n\n+/)
    .filter(paragraph => paragraph.trim() !== '')
    .map(para => para.trim());
}

// Clean content by removing HTML/Angular component tags and markdown formatting
function cleanContent(content) {
  return content
    // Remove component tags but keep their content
    .replace(/<docs-[^>]*>(.*?)<\/docs-[^>]*>/g, '$1')
    // Remove self-closing component tags
    .replace(/<docs-[^>]*\/>/g, '')
    // Remove other HTML-like tags but keep their content
    .replace(/<[^>]*>(.*?)<\/[^>]*>/g, '$1')
    // Remove remaining self-closing tags
    .replace(/<[^>]*\/>/g, '')
    // Remove Markdown link syntax
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    // Remove bold formatting
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    // Remove italic formatting
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Remove inline code
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Truncate content to prevent overly large index files
function truncateContent(paragraphs, maxLength = CONFIG.maxContentLength) {
  return paragraphs.map(paragraph => {
    if (paragraph.length <= maxLength) return paragraph;
    return paragraph.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  });
}

// Create a URL-friendly slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-{2,}/g, '-')
    .replace(/^\-+|\-+$/g, '');
}

// Execute the function immediately
buildSearchIndex().catch(error => {
  console.error('Error building search index:', error);
  process.exit(1);
});