module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  modulePathIgnorePatterns: ["<rootDir>/.aws-sam"],
  clearMocks: true,
  reporters: ["default", "jest-junit"],
  coverageThreshold: {
    global: {
      statements: 60,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: ["./src/**/*"],
  coveragePathIgnorePatterns: [
    ".index.ts",
    ".main.ts",
    "src/infrastructure/kafka/CardRequestConsumer.ts"
  ],
  testTimeout: 30000,
};
