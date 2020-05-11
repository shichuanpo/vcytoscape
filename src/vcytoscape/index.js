
import vcytoscape from './components/vcytoscape.vue'
import vcytoscapeLegend from './components/vcytoscape-legend.vue'
import cytoscape from 'cytoscape'
import fieldElColorPicker from './vue-form-generator-fields/fieldElColorPicker.vue'
import fieldImageUpload from './vue-form-generator-fields/fieldImageUpload.vue'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import { createBus } from './common/eventBus'
export default {
  install (Vue, options) {
    Vue.component(vcytoscape.name, vcytoscape)
    Vue.component(vcytoscapeLegend.name, vcytoscapeLegend)
    Vue.component('fieldElColorPicker', fieldElColorPicker)
    Vue.component('fieldImageUpload', fieldImageUpload)
    Vue.use(VueFormGenerator)
    createBus(Vue)
    options && options.beforeCreate && options.beforeCreate(cytoscape)
  }
}
