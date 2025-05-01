/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin, Plugin } from 'vite';
import { readFileSync } from 'fs';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { resolve } from 'path';

export function viteDirectoryResolver() {
  return {
    name: 'vite-directory-resolver',
    
    // This hook runs when Vite tries to resolve an import
    resolveId(source, importer, options) {
      // Only process our primitives imports
      if (source.startsWith('@vacui-ui/primitives/') && !source.endsWith('/index')) {
        // Make sure we're not already handling an index file and not a file with extension
        if (!source.endsWith('.ts') && !source.endsWith('.js')) {
          // Log what we're doing for debugging
          console.log(`[vite-directory-resolver] Redirecting ${source} to ${source}/index`);
          
          // Tell Vite to look for the index file instead
          return `${source}/index`;
        }
      }
      
      // For other imports, let Vite handle them normally
      return null;
    }
  };
}

function sourceQueryPlugin(): Plugin {
  return {
    name: 'source-query-plugin',
    transform(code: string, id: string) {
      // Check if the import has a ?source query
      if (id.includes('?source')) {
        // Get the source file path
        const source = readFileSync(id.replace('?source', '')).toString();

        // Replace the import statement with a string literal
        code = `export default \`${source.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`;`;
      }
      return code;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: `../../node_modules/.vite`,

    build: {
      outDir: '../../dist/apps/docs/client',
      reportCompressedSize: true,
      target: ['es2020']
    },
    
    server: {
      fs: {
        // Allow serving files from the project root and primitives
        allow: ['.', '..', '../../primitives'],
        strict: false
      },
    },
    
    resolve: {
      mainFields: ['module'],
      preserveSymlinks: false,
      // Add this to help with resolving index files
      extensions: ['.ts', '.js', '.json', '.mjs'],
      // Verify our aliases
      alias: {
        '@vacui-ui/primitives': resolve(__dirname, '../../primitives'),
        tslib: resolve(__dirname, '../../node_modules/tslib/tslib.js'),
      }
    },

    ssr: {
      noExternal: [
        '@vacui-ui/primitives'
      ],
    },
    
    plugins: [
      
      analog({
        ssr: true,
        vite: {
          experimental: {
            supportAnalogFormat: true,
          },
        },
        prerender: {
          routes: async () => [
            '/',
            '/docs',
            {
              contentDir: 'src/content/docs/overview',
              transform: (file) => {
                // Skip any draft files if you have that attribute
                // if (file.attributes.draft) return false;
                
                // Use the file's name (without extension) as the slug
                return `/docs/overview/${file.name}`;
              },
            },
            {
              contentDir: 'src/content/docs/directives',
              transform: (file) => {
                // Skip any draft files if you have that attribute
                // if (file.attributes.draft) return false;
                
                // Use the file's name (without extension) as the slug
                return `/docs/directives/${file.name}`;
              },
            }
          ],
        },
      }),
      nxViteTsPaths(),
      splitVendorChunkPlugin(),
      sourceQueryPlugin()
    ],
    
    // Help Vite optimize dependencies
    optimizeDeps: {
      include: ['@vacui-ui/primitives'],
      // Force Vite to process these directories
      entries: [
        './src/**/*.ts',
        '../../primitives/**/*.ts'
      ]
    },
    
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});