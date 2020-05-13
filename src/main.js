import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang zh-CN 

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import request from '@/utils/request'

import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.prototype.req = request

Vue.config.productionTip = false

// 分页组件
import Pagination from '@/components/Pagination'
Vue.component('pagination', Pagination)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
