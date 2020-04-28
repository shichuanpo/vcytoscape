import Vue from 'vue'
import demo from './index.vue'
import vcytoscape from '../../vcytoscape'
import d3Force from 'cytoscape-d3-force'
import './iconfont/iconfont.css'
Vue.config.productionTip = false
Vue.use(vcytoscape, {
  beforeCreate: (Cytoscape) => {
    Cytoscape.use(d3Force)
  }
})
new Vue({
  render: h => h(demo)
}).$mount('#app')
