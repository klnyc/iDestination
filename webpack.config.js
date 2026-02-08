module.exports = {
    entry: './src/app',
    mode: 'development',
    output: {
      path: __dirname,
      filename: './public/bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
      },
    devtool: 'source-maps',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  }