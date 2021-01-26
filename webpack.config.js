const resolve = require('path').resolve
const path = require('path')
const fs = require('fs')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (options = {}) => ({
    entry: {
        index: './web/main.js'
    },
    output: {
        path: resolve(__dirname, 'dist'),
    },
    module: {
        rules: []
    },
    plugins: [
        new HtmlWebpackPlugin({template: './web/entry.html'}),
        new CopyPlugin({
            patterns: [
                {
                    from: "web/site/**/*.html", to: ".",
                    transform(content, currentPath) {
                        let layoutPath = path.join(__dirname, 'web/layouts/home/main-iframe.html');
                        let layoutContent = fs.readFileSync(layoutPath, 'utf-8');
                        console.log(layoutContent);
                        content = content.toString();
                        content = layoutContent.replace('{{content}}', content)

                        return content;
                    },
                },
                {
                    from: "web/public/**/*", to: "."
                },
            ],
            options: {
                concurrency: 100,
            },
        }),
    ],
    resolve: {},
    devServer: {
        host: '127.0.0.1',
        port: 8010,
        proxy: {
            '/api/': {
                target: 'http://www.xxx.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
})
