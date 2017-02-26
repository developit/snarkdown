import buble from 'rollup-plugin-buble';

export default {
	useStrict: false,
	sourceMap: true,
	entry: 'src/index.js',
	plugins: [
		buble()
	]
};
