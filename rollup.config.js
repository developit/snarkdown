import buble from 'rollup-plugin-buble';

let { FORMAT } = process.env;

export default {
	useStrict: false,
	sourceMap: true,
	entry: 'src/index.js',
	plugins: [
		buble(),
		FORMAT==='cjs',
		FORMAT==='umd'
	]
};
