const base = require('../../configs/jest.config')

module.exports = {
  ...base,
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['./test/setupTests.ts'],
}
