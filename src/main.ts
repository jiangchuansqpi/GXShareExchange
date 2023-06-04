import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import Element from './element'
import { Message, Table, TableColumn, Pagination } from 'element-ui'
import VueBus from 'vue-bus';

Vue.use(VueBus);
Vue.config.productionTip = false

Vue.use(Element)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
