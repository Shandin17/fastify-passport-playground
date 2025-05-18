'use strict';

const init = require('eslint-config-metarhia');

module.exports = [
  ...init,
  {
    rules: {
      'max-len': 'off',
      camelcase: 'off',
      'no-unused-vars': 'warn',
      'no-use-before-define': 'off',
    },
  },
];
