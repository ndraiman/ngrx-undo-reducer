module.exports = {
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { stringifyContentPathRegex: '\\.html?$', tsconfig: 'tsconfig.spec.json' }]
	},
	testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
	moduleFileExtensions: ['html', 'js', 'ts'],
	testResultsProcessor: 'jest-teamcity-reporter',
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 70,
			statements: 70
		}
	},
	coverageReporters: ['json', 'lcov', 'text', 'teamcity'],
	preset: 'ts-jest'
};
