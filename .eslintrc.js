module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 0,
    'no-restricted-syntax': [ 
      'error', 
      { 
        selector: 'ForInStatement', 
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.', 
      }, 
      { 
        selector: 'LabeledStatement', 
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.', 
      }, 
      { 
        selector: 'WithStatement', 
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.', 
      }, 
    ], 
    'no-await-in-loop': 0,
    'no-void': ['error', { 'allowAsStatement': true }],
  },
};
