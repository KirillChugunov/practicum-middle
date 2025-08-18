/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'json', 'jsx', 'tsx'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '\\.svg$': '<rootDir>/__mocks__/svgTransform.cjs',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@features$': '<rootDir>/src/features/index.ts',
    '^@shared$': '<rootDir>/src/shared/index.ts',
    '^@pages$': '<rootDir>/src/pages/index.ts',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  roots: ['<rootDir>/src', '<rootDir>/test'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
};
