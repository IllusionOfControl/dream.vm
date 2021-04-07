const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    context: path.resolve(__dirname, "./src"),
    entry: [
        "./index.js",
    ],
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.ttf$/i,
                use: ["file-loader"],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: "./index.html"
            }
        ),
        new CleanWebpackPlugin(),
    ]
};