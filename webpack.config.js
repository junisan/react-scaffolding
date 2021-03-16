const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = (props, {mode}) => {
    const isDev = mode === 'development';

    const devServer = isDev ? {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3007
    } : {}

    const optimization = isDev ? {} : {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    }

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            publicPath: '/',
            assetModuleFilename: 'assets/images/[hash][ext][query]'
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                '@components': path.resolve(__dirname, 'src/components/'),
                '@styles': path.resolve(__dirname, 'src/styles/'),
                '@images': path.resolve(__dirname, 'src/assets/images'),
            }
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.html$/,
                    use: [
                        { loader: 'html-loader'}
                    ]
                },
                {
                    test: /\.s?css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] //'style-loader'
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff|woff2)$/i,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: "application/font-woff",
                            name: "[name].[contenthash].[ext]",
                            outputPath: "./assets/fonts/",
                            publicPath: "./assets/fonts/",
                            esModule: false
                        }
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: './index.html'
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css'
            }),
            new CleanWebpackPlugin(),

        ],
        devServer: devServer,
        optimization: optimization
    }
}