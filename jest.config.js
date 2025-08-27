module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest']
  },
  testMatch: ['**/test/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.d.ts',
    '!**/node_modules/**'
  ],
  moduleFileExtensions: ['js', 'json'],
  verbose: true
};