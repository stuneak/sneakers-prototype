// const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
// const postcssSass = require('@csstools/postcss-sass');

module.exports = {
	plugins: {
		tailwindcss: {},

		autoprefixer,
		'postcss-preset-mantine': {
			autoRem: true,
		},
		'postcss-simple-vars': {
			variables: {
				'mantine-breakpoint-xs': '36em',
				'mantine-breakpoint-sm': '48em',
				'mantine-breakpoint-md': '62em',
				'mantine-breakpoint-lg': '75em',
				'mantine-breakpoint-xl': '88em',
			},
		},
	},
};

/*
plugins: [tailwindcss('./tailwind.config.cjs'), autoprefixer],
*/
