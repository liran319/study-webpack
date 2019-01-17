const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const port = process.env.PORT || 8888
const siteConfig = {
  publicPath: `./dist/`
}

const extractSass = new extractTextPlugin({
  filename: "[name].css",
  disable: process.env.NODE_ENV === "development"
})

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    // publicPath: siteConfig.publicPath,
    filename: '[name].js'
  },
  module: {
    rules: [
      // scss loader
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                autoprefixer({
                  'browsers': ['> 1%', 'last 2 versions']
                })
              ],
            }
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }]
        })
      },
      // babel loader
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|jpeg)/,  //是匹配图片文件后缀名称
        use:[{
          loader: 'url-loader', //是指定使用的loader和loader的配置参数
          options:{
            limit: 1024,  //是把小于500B的文件打成Base64的格式，写入JS
            name: 'images/[hash:32].[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      test: /\.js($|\?)/i,
      include: /src/,
      parallel: true
    }),
    new HtmlPlugin({
      minify:{ //是对html文件进行压缩
        removeAttributeQuotes: false  //removeAttrubuteQuotes是却掉属性的双引号。
      },
      hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
      template: './src/index.html' //是要打包的html模版路径和文件名称。
    }),
    extractSass,
    // new extractTextPlugin('stylesheets/main.css')
  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: 'localhost',
    compress: true,
    port: port
  }
}