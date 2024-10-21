// eslint-disable-next-line no-undef
module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  maxConcurrency: 1,
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: [
    "src/**/*.ts", // Adjust based on where your source files are located
    "!src/**/*.d.ts", // Exclude TypeScript declaration files
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/importReflectMetadata.ts"],
};
