var webpack = require('webpack');
var fs = require('fs');
var path = require('path');
var pkg = JSON.parse(fs.readFileSync('./package.json'));

var header =
`bindings.js v${pkg.version}
build-date: ${new Date()}`;

var base = {
	entry: './src/index.ts',
	resolve: {
		extensions: ['.ts','.js','.json']
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		library: 'bindings',
		libraryTarget: 'umd'
	},
	externals: {
		'object.observe': 'Object.observe'
	},
	plugins: [
		new webpack.EnvironmentPlugin('NODE_ENV'),
		new webpack.BannerPlugin(header)
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: 'awesome-typescript-loader'
			}
		]
	},
	devtool: 'source-map',
	context: __dirname
}

var dev, prod, bundle;
module.exports = [
	// build
	dev = Object.assign({},base,{
		output: Object.assign({},base.output,{
			filename: 'bindings.js'
		}),
	}),

	// min build
	prod = Object.assign({},base,{
		output: Object.assign({},base.output,{
			filename: 'bindings.min.js'
		}),
		plugins: [
			base.plugins[0],
			new webpack.optimize.UglifyJsPlugin({
				comments: false,
				sourceMap: true
			}),
			base.plugins[1]
		]
	}),

	// bundle build
	bundle = Object.assign({},dev,{
		output: Object.assign({},base.output,{
			filename: 'bindings.bundle.js'
		}),
		externals: {}
	}),

	// bundle min build
	Object.assign({},prod,{
		output: Object.assign({},base.output,{
			filename: 'bindings.bundle.min.js'
		}),
		externals: {}
	})
];
