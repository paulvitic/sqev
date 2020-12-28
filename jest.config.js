module.exports = {
    collectCoverage: false,
    testEnvironment: 'node',
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/**/*.{ts}",
        "!**/*test.{ts}",
        "!**/*.d.{ts}",
        "!**/build",
        "!**/.stryker-tmp",
        "!**/(TypeOrm|FileEventStore)/*",
        "!**/FileEventStore.ts"
    ],
    coverageReporters: [
        "json-summary",
        "text",
        "lcov"
    ],
    modulePathIgnorePatterns: [
        ".stryker-tmp"
    ],
    coverageThreshold: {
        "global": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 0
        }
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json"
    ],
    transform: {
        "\\.(ts|tsx)$": "ts-jest"
    },
    testRegex: ".*\\.test\\.ts$",
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
        }
    }
};
