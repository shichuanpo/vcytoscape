
import vcytoscape from './vcytoscape/vcytoscape.vue'
import vcytoscapeLegend from './vcytoscape/vcytoscape-legend.vue'
import cytoscape from 'cytoscape'

export default {
  install (Vue, options) {
    Vue.component(vcytoscape.name, vcytoscape)
    Vue.component(vcytoscapeLegend.name, vcytoscapeLegend)
    options.beforeCreate && options.beforeCreate(cytoscape)
  }
}

export { vcytoscape, vcytoscapeLegend }
