import Vue from 'vue'
import demo from './demo.vue'
import vcytoscape from './vcytoscape'
import d3Force from 'cytoscape-d3-force'
import contextMenus from 'cytoscape-context-menus'
import $ from 'jquery'
import 'cytoscape-context-menus/cytoscape-context-menus.css'
import popper from 'cytoscape-popper'
Vue.config.productionTip = false
Vue.use(vcytoscape, {
  beforeCreate: (Cytoscape) => {
    Cytoscape.use(contextMenus, $)
    Cytoscape.use(popper)
    Cytoscape.use(d3Force)
  }
})
new Vue({
  render: h => h(demo)
}).$mount('#app')
