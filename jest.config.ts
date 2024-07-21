/** @type {import('jest').Config} */
const config = {
	roots: ['<rootDir>'],
	testEnvironment: 'node',
	verbose: true,
	clearMocks: true,
	transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
	moduleFileExtensions: ['js', 'ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
}

export default config
