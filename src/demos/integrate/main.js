import Vue from 'vue'
import demo from './index.vue'
import vcytoscape from '../../vcytoscape'
import d3Force from 'cytoscape-d3-force'
import cola from 'cytoscape-cola'
import popper from 'cytoscape-popper'
import klay from 'cytoscape-klay'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.use(vcytoscape, {
  beforeCreate: (Cytoscape) => { // inject plugin for cytoscape
    Cytoscape.use(cola)
    Cytoscape.use(klay)
    Cytoscape.use(d3Force)
    Cytoscape.use(popper)
  }
})
new Vue({
  render: h => h(demo)
}).$mount('#app')
