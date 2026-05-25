module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.+(spec|test).ts?(x)"],
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
  coveragePathIgnorePatterns: [".index.ts"],
};
