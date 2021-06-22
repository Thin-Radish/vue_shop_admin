import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/elelment.js'

//导入字体图标
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

//导入全局样式表
import 'assets/css/global.css'

//导入全局过滤器
import Filters from 'common/filter'
Vue.use(Filters)

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
