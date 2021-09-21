const path = require('path');

module.exports = {
    mode: 'development',
    entry: './routes/route.js',
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'index.bundle.js',
    },
    devtool: 'inline-source-map',
};