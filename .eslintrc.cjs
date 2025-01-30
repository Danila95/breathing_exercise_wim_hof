module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: false
	},
	ignorePatterns: ['build/'], // игнорируем некоторые папки
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:i18next/recommended',
		'airbnb',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:jsx-a11y/recommended',
		'prettier',
		'plugin:prettier/recommended'
	],
	overrides: [
		{
			env: {
				node: true
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script'
			}
		},
		{
			files: ['**/src/**/*.test.{ts,tsx}'],
			rules: {
				'i18next/no-literal-string': 'off'
			}
		}
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: [
		'prettier',
		'@typescript-eslint',
		'react',
		'i18next',
		'react-hooks'
	],
	rules: {
		'consistent-return': 'off',
		'no-plusplus': 'off',
		'prefer-destructuring': 'off',
		'import/no-cycle': 'off',
		'func-names': 'off',
		indent: 'off',
		// 'linebreak-style': ['error', 'windows'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'react/react-in-jsx-scope': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'i18next/no-literal-string': [
			'error',
			{ markupOnly: true, ignoreAttribute: ['to'] }
		],
		'react/jsx-uses-react': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/require-default-props': 'off',
		'react/function-component-definition': 'off',
		'react/display-name': 'off',
		'react/jsx-no-useless-fragment': 'off',
		'react/no-array-index-key': 'off',
		'no-underscore-dangle': 'off',
		'no-console': [
			"warn",
			{ "allow": ["error"] }
		],
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
		'react-hooks/exhaustive-deps': 'error', // Checks effect dependencies
		'no-param-reassign': 'off',
		'no-undef': 'off',
		'max-len': [
			'warn',
			{
				ignoreComments: true,
				code: 132
			}
		],
		'react/prop-types': [
			1,
			{
				skipUndeclared: true
			}
		],
		'import/no-unresolved': 'off',
		'import/extensions': 'off',
		'import/prefer-default-export': ['off'],
		'prettier/prettier': [
			'error',
			{
				trailingComma: 'none',
				tabWidth: 2,
				useTabs: true,
				semi: false,
				singleQuote: true,
				arrowParens: 'avoid',
				jsxSingleQuote: true,
				bracketSpacing: true,
				bracketSameLine: false,
				printWidth: 80,
				endOfLine: 'auto',
				singleAttributePerLine: true
			}
		],
		'@typescript-eslint/no-shadow': 'off',
		'no-shadow': 'off',
		'react/jsx-filename-extension': [
			1,
			{
				extensions: ['.tsx']
			}
		],
		'import/no-extraneous-dependencies': 'off'
	},
	globals: {
		__IS_DEV__: true,
		__API__: true,
		__ENV__: true,
		__PROJECT__: true
	},
	settings: {
		'import/extensions': ['.js', '.jsx', '.tsx', '.ts'],
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx']
		},
		'import/resolver': {
			typescript: {}
		}
	}
}
