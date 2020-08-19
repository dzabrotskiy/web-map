/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const cp = require('child_process')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const {NODE_ENV} = process.env
const PORT = process.env.PORT || 3000
const isDevelopment = NODE_ENV !== 'production'
const HASH = cp.execSync('git rev-parse HEAD').toString()
const BUILD_TIME = new Date().toLocaleString()

const DIR_ROOT = path.join(__dirname)
const DIR_APP_DIST = path.join(DIR_ROOT, 'dist')
const DIR_APP_SRC = path.join(DIR_ROOT, 'src')
const PATH_TO_INDEX_FILE = path.join(DIR_APP_SRC, 'index.tsx')

console.log(`[webpack.config] NODE_ENV:  ${NODE_ENV}`)
console.log(`[webpack.config] platform:  ${process.platform}`)
console.log(`[webpack.config] BUILD_TIME: ${BUILD_TIME}`)
console.log(`[webpack.config] HASH: ${HASH}`)

const BUILD = Object.assign(
  {},
  {
    htmlTemplateName: path.join(DIR_APP_SRC, 'index.html')
  }
)

const config = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'source-map' : false,
  entry: PATH_TO_INDEX_FILE,
  output: {
    path: DIR_APP_DIST,
    filename: isDevelopment ? '[name].js' : '[name].js?[hash]',
    chunkFilename: '[name].js?[chunkhash]'
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      name: true,
      cacheGroups: {
        vendors: {
          reuseExistingChunk: true
        }
      }
    },
    removeEmptyChunks: true
  },
  devServer: {
    hot: true,
    https: false,
    port: PORT,
    stats: 'minimal',
    staticOptions: {
      extensions: ['html']
    }
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.ts', '.js', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [DIR_APP_SRC],
        use: [{loader: 'ts-loader'}]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: BUILD.htmlTemplateName
    })
  ]
}

module.exports = config
