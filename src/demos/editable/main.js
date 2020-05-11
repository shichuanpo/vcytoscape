import Vue from 'vue'
import demo from './index.vue'
import vcytoscape from '../../vcytoscape'
Vue.use(vcytoscape)
new Vue({
  render: h => h(demo)
}).$mount('#app')
