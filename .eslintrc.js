module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: 'tsconfig.json',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'html',
    'import',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb-typescript/base',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    semi: ['error', 'never'],
    '@typescript-eslint/semi': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', { before: false, after: true }],
    curly: ['error', 'multi-line'],
    'vue/component-tags-order': [
      'error',
      {
        'order': ['template', 'script', 'style']
      }
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      { 'registeredComponentsOnly': true }
    ],
    'vue/no-reserved-component-names': 'error',
    'vue/component-api-style': ['error', ['script-setup']],
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'vue/no-unregistered-components': [
      'error',
      { 'ignorePatterns': ['router-link', 'router-view'] }
    ],
    'vue/no-lone-template': [
      'error',
      {
        'ignoreAccessible': false
      }
    ],
    'vue/no-useless-v-bind': [
      'error',
      {
        'ignoreIncludesComment': false,
        'ignoreStringEscape': false
      }
    ],
    'vue/no-v-text': ['error'],
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/v-for-delimiter-style': ['error', 'of'],
    'vue/v-on-event-hyphenation': [
      'error',
      'always',
      {
        'autofix': true
      }
    ],
    'vue/v-on-function-call': ['error', 'never'],
  },
  'overrides': [
    {
      'files': ['**/*.spec.ts', '**/*.test.ts'],
      'rules': { '@typescript-eslint/no-explicit-any': 'off' }
    },
    {
      'files': ['**/pages/**/*.vue'],
      'rules': {
        'vue/multi-word-component-names': 'off'
      }
    }
  ]
}

