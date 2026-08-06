import js from '@eslint/js'
import react from 'eslint-plugin-react'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      react
    },
    settings: {
      react: {
        version: '19.0.0'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': ['warn', {
        varsIgnorePattern: '^(_|[A-Z])',
        argsIgnorePattern: '^(_|[A-Z])',
        caughtErrorsIgnorePattern: '^(_|[A-Z])',
        ignoreRestSiblings: true
      }],
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'no-undef': 'error'
    }
  }
]
