// Jest + React Testing Library + MSW
export default {
  testEnvironment: "jest-fixed-jsdom", // jsdom that also exposes fetch / Request for MSW
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx", esModuleInterop: true } }],
  },
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  clearMocks: true,
};
