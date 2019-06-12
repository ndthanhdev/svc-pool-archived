const base = require('../../configs/jest.config')

module.exports = {
  ...base,
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
}
