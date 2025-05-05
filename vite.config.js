const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {fileURLToPath, URL} = require("node:url");
const buildPath = process.env.BUILDPATH || 'dist';
const templatePath = 'src/templates/'

module.exports = {
    //publicPath : '/my-app/',
    outputDir : buildPath,
    filenameHashing : false,
    runtimeCompiler: true,
    configureWebpack: {
        plugins: [
            // copy custom static assets
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'static'),
                        //to: buildPath,
                        //filter: ['.*']
                    }
                ]

            })
        ]
    },
    resolve: {
        alias: {
            '@templates': path.resolve(__dirname, './src/templates'),
        },
    },
}
