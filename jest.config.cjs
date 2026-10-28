module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^axios$': require.resolve('axios'),
  },
  testMatch: ['**/*.test.js', '**/*.test.jsx'],

  // Cobertura: se mide el código de la app, no las pruebas ni los archivos de apoyo
  
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/setupTests.js',
    '!src/utils/testUtils.jsx',
    '!src/utils/mockData.js',
    '!src/**/*.test.{js,jsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};