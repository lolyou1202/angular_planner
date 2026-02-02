module.exports = [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.spec.json'],
                tsconfigRootDir: __dirname
            }
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            '@angular-eslint': require('@angular-eslint/eslint-plugin')
        },
        rules: {
            // TypeScript specific rules
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: false, // Запрещает выражения без типа
                    allowTypedFunctionExpressions: true, // Разрешает выражения с типом
                    allowHigherOrderFunctions: true, // Разрешает функции высшего порядка
                    allowDirectConstAssertionInArrowFunctions: true, // Разрешает const assertions
                    allowConciseArrowFunctionExpressionsStartingWithVoid: false // Запрещает void без типа
                }
            ],
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit', // Требует явного указания public/private/protected
                    overrides: {
                        constructors: 'no-public', // Конструкторы могут быть без public
                        accessors: 'explicit' // Геттеры/сеттеры тоже требуют модификатор
                    }
                }
            ],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': 'error',

            // Angular specific rules
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase'
                }
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case'
                }
            ]
        }
    },

    // Configuration for HTML template files
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: require('@angular-eslint/template-parser')
        },
        plugins: {
            '@angular-eslint/template': require('@angular-eslint/eslint-plugin-template')
        },
        rules: {
            // Basic template rule
            '@angular-eslint/template/eqeqeq': 'error'
        }
    }
]
