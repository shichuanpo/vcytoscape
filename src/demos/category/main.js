import Vue from 'vue'
import demo from './index.vue'
import vcytoscape from '../../vcytoscape'
Vue.config.productionTip = false
Vue.use(vcytoscape, {})
new Vue({
  render: h => h(demo)
}).$mount('#app')
