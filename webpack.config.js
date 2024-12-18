const baseConfig = require( '@wordpress/scripts/config/webpack.config' );
const { getWebpackEntryPoints } = require('@wordpress/scripts/utils');

let scriptConfig = {
	...baseConfig,

	entry: () => ({
		index: './src/index.js',
		...(getWebpackEntryPoints('script')()),
	}),
};
module.exports = scriptConfig;
