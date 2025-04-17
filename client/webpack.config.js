const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
	const isProduction = env.NODE_ENV === 'production';
	const dotenvFilename = isProduction ? '.env.prod' : '.env.dev';

	return {
		entry: ['regenerator-runtime/runtime.js', 'index.jsx'],
		output: {
			path: path.resolve(__dirname, './dist'),
			filename: isProduction ? '[name].[contenthash].js' : '[name].js',
			publicPath: '/',
		},
		target: 'web',
		devServer: {
			historyApiFallback: true,
			proxy: [
				{
					context: ['/api'],
					target: 'http://localhost:3000',
					secure: false,
				},
			],
			port: '3030',
			static: {
				directory: path.join(__dirname, 'public'),
			},
			open: true,
			hot: true,
			liveReload: true,
			host: '0.0.0.0',
			allowedHosts: ['.localhost'],
			headers: {
				'Access-Control-Allow-Origin': '*', // Allow all origins
				'Access-Control-Allow-Methods':
					'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers':
					'X-Requested-With, content-type, Authorization',
			},
			devMiddleware: {
				publicPath: '/',
			},
			setupMiddlewares: (middlewares, devServer) => {
				if (!devServer) {
					throw new Error('webpack-dev-server is not defined');
				}

				devServer.app.get('/*', (req, res, next) => {
					const host = req.hostname;
					const fullHost = req.headers.host;
					if (
						host === 'image.localhost' ||
						fullHost === 'image.localhost:3030'
					) {
						// Redirect all requests from images.localhost:3030 to images.localhost:3000
						return res.redirect(`http://image.localhost:3000${req.url}`);
					}
					next();
				});

				return middlewares;
			},
		},
		resolve: {
			extensions: ['.js', '.jsx', '.json'],
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{
					test: /\.css$/i,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader',
						'postcss-loader',
					],
				},
				{
					test: /\.(png|jpe?g|gif|ico)$/i,
					loader: 'file-loader',
					options: {
						name: isProduction
							? 'assets/[name].[contenthash].[ext]'
							: 'assets/[name].[ext]',
					},
				},
				{
					test: /\.svg$/i,
					oneOf: [
						{
							// For SVG imports ending with ?react
							resourceQuery: /react/,
							use: ['@svgr/webpack'],
						},
						{
							// For regular SVG imports as URLs
							type: 'asset/resource',
							generator: {
								filename: isProduction
									? 'src/images/[name].[contenthash][ext]'
									: 'src/images/[name][ext]',
							},
						},
					],
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: 'asset/resource',
					generator: {
						filename: isProduction
							? 'fonts/[name].[contenthash][ext]'
							: 'fonts/[name][ext]',
					},
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.join(__dirname, 'public', 'index.html'),
			}),
			new Dotenv({
				path: dotenvFilename,
			}),
			new CopyPlugin({
				patterns: [
					{
						from: './fonts',
						to: './fonts',
					},
					{
						from: './src/images',
						to: './images',
					},
					{
						from: './public/apple-touch-icon.png',
						to: './apple-touch-icon.png',
					},
					{ from: './public/favicon-16x16.png', to: './favicon-16x16.png' },
					{ from: './public/favicon-32x32.png', to: './favicon-32x32.png' },
					{ from: './public/favicon.ico', to: './favicon.ico' },
				],
			}),
			new MiniCssExtractPlugin({
				filename: isProduction ? '[name].[contenthash].css' : '[name].css',
			}),
		],
	};
};
