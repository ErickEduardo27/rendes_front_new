const path = require('path');

module.exports = {
  publicPath: '/rendes/',
  transpileDependencies: ['vue-echarts', 'resize-detector', 'chart.js'],
  configureWebpack: {
    resolve: {
      alias: {
        '@services': path.resolve(__dirname, 'src/services'),
        '@components': path.resolve(__dirname, 'src/components')
      }
    }
  }
};
