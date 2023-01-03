module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'node', 'prettier', 'import'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true, allowBoolean: true, allowNullish: true }],
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
  }
};
