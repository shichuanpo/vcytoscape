
import vcytoscape from './components/vcytoscape.vue'
import vcytoscapeLegend from './components/vcytoscape-legend.vue'
import vcytoscapeSetting from './components/vcytoscape-setting'
import cytoscape from 'cytoscape'
import fieldElColorPicker from './vue-form-generator-fields/fieldElColorPicker.vue'
import fieldImageUpload from './vue-form-generator-fields/fieldImageSelect.vue'
import { nodeSchema, edgeSchema } from './config'
import Vue from 'vue'
Vue.component('fieldElColorPicker', fieldElColorPicker)
Vue.component('fieldImageSelect', fieldImageUpload)
export {
  vcytoscapeSetting,
  vcytoscapeLegend,
  vcytoscape,
  nodeSchema,
  edgeSchema
}
export default {
  install (Vue, options) {
    Vue.component(vcytoscape.name, vcytoscape)
    Vue.component(vcytoscapeSetting.name, vcytoscapeSetting)
    Vue.component(vcytoscapeLegend.name, vcytoscapeLegend)
    options && options.beforeCreate && options.beforeCreate(cytoscape)
  }
}
