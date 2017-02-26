import buble from 'rollup-plugin-buble';

let pkg = require('./package.json');

export default {
	moduleName: pkg.name,
	entry: 'src/index.js',
	useStrict: false,
	sourceMap: true,
	plugins: [
		buble()
	],
	targets: [
		{ format:'cjs', dest: pkg.main },
		{ format:'es', dest: pkg.module },
		{ format:'umd', dest: pkg['umd:main'] }
	]
};
