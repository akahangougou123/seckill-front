/*
 * @Description: 配置文件
 * @Author: hai-27
 * @Date: 2020-02-07 16:23:00
 * @LastEditors: hai-27
 * @LastEditTime: 2021-03-03 22:32:57
 */
module.exports = {
  publicPath: './',
  //输出文件目录
  outputDir:'dist',
  devServer: {
    host: 'localhost',
    open: true,
    proxy: {
      '/api': { //匹配所有以“/api”开头的接口i
        target: 'http://localhost:8088/seckill', // 本地后端地址
        // target: 'http://106.15.179.105:3000/', // 线上后端地址
        changeOrigin: true, //允许跨域
         pathRewrite: {
          '^/api': ''
        },
        logLevel:'debug',
        secure:false,
        onProxyReq: (proxyReq, req) => {
          // http请求
          console.log('[HPM] %s %s %s %s', req.method, req.originalUrl, '->', req.url);
        },
       
      }
    }
  }
}