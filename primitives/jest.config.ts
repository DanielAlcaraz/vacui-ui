/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "C:\\Users\\Daniel\\AppData\\Local\\Temp\\jest",

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Display name for the test suite
  displayName: 'primitives',

  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: '../coverage/primitives',

  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: 'v8',

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@vacui-ui/primitives/(.*)$': '<rootDir>/$1/index.ts',
  },

  // A preset that is used as a base for Jest's configuration
  preset: '../jest.preset.js',

  // A list of paths to directories that Jest should use to search for files in
  

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // Transform configuration for files
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};

export default config;
