module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	rules: {
		"comma-dangle": ["error", "never"],
		"curly": ["error", "multi-or-nest"],
		"indent": ["error", "tab"],
		"no-trailing-spaces": "error",
		"no-var": "error",
		"nonblock-statement-body-position": ["error", "below"],
		"prefer-const": "error"
	}
};
