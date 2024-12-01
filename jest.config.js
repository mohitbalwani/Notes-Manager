module.exports = {
    clearMocks: true,
    setupFilesAfterEnv: ["regenerator-runtime/runtime"],
    transformIgnorePatterns: ["/node_modules/(?!(jsdom)/)"],
    testPathIgnorePatterns: ["/node_modules/"],
    useStderr: true,
  };
  