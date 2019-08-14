/* eslint-disable */
const path = require('path')
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
// vue.config.js 配置说明
// 这里只列一部分，具体配置惨考文档啊
module.exports = {
  // baseUrl  type:{string} default:'/'
  // 将部署应用程序的基本URL
  // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
  // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.foobar.com/my-app/，集baseUrl到'/my-app/'.
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: false,

  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,

  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项
// vue.config.js
 devServer: {
    port: 8080, // 端口号
    host: 'localhost',
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    proxy: {
      '/api': {
        target: 'http://139.9.53.12:8088',
        ws: true,
        changeOrigin: true,
        pathRequiresRewrite: {
          "^/api": ""
        }
      }
    }// 配置多个代理
  },
  configureWebpack: (config) => {
    config.plugins.push(new SkeletonWebpackPlugin({
      webpackConfig: {
        entry: {
          app: path.join(__dirname, './src/config/skeleton.js'),
        },
      },
      minimize: true,
      quiet: true,
    }))
  },
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
}



