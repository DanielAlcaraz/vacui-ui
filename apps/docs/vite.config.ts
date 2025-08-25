/// <reference types="vitest" />

import analog, { PrerenderContentFile } from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { resolve } from 'path';

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
        '@vacui-kit/primitives': resolve(__dirname, '../../primitives'),
        tslib: resolve(__dirname, '../../node_modules/tslib/tslib.js'),
      }
    },

    ssr: {
      noExternal: [
        '@vacui-kit/primitives'
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
              staticData: true,
              transform: (file: PrerenderContentFile) => {
                // Skip any draft files if you have that attribute
                // if (file.attributes.draft) return false;
                
                // Use the file's name (without extension) as the slug
                const slug = file.attributes['slug'] || file.name;
                return `/docs/overview/${slug}`;
              },
            },
            {
              contentDir: 'src/content/docs/directives',
              staticData: true,
              transform: (file: PrerenderContentFile) => {
                // Skip any draft files if you have that attribute
                // if (file.attributes.draft) return false;
                
                // Use the file's name (without extension) as the slug
                const slug = file.attributes['slug'] || file.name;
                return `/docs/directives/${slug}`;
              },
            }
          ],
        },
      }),
      nxViteTsPaths(),
      splitVendorChunkPlugin()
    ],
    
    // Help Vite optimize dependencies
    optimizeDeps: {
      include: ['@vacui-kit/primitives'],
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