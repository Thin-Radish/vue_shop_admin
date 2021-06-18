module.exports = {
  configureWebpack: {
    resolve: {
      alias:{
        'assets':'@/assets',
        'common':'@/common',
        'components':'@/components',
        'api':'@/api',
        'views':'@/views',
      }
    }
  },
  devServer: {
    open:true,
    proxy: { 
      '/api': {
        target: 'http://127.0.0.1:8888/api/private/v1/', 
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
}
