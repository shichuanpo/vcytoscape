<template lang="pug">
#app.cytoscape
  vcytoscape.cytoscape(ref="cytoscape", :option="option", :toolbar="toolbarOption", :category="category", :data="graphData")
    template(v-slot:toolbar-before="scope")
      el-popover(
        placement="bottom",
        trigger="hover"
      )
        el-radio(v-model="layout", v-for="l in layoutList", :key="l", :label="l") {{l}}
        i.el-icon-s-grid(slot="reference")
</template>

<script>
import { createData } from '../../mock'
import category from './category'
import option from './option'
import toolbar from './toolbar'
export default {
  name: 'cytoscapePage',
  components: { toolbar },
  data () {
    return {
      category,
      option,
      graphData: [],
      toolbarOption: {
        content: true
      },
      layout: 'cose',
      layoutList: ['cose', 'random', 'grid', 'circle', 'concentric', 'breadthfirst']
    }
  },
  watch: {
    layout (val) {
      option.layout.name = val
    }
  },
  mounted () {
    setTimeout(() => {
      this.graphData = createData(80)
    }, 100)
  }
}
</script>
<style lang="less" scoped>
.cytoscape {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}
.el-icon-s-grid{
  margin-left: 10px;
  color:rgba(0, 0, 0, 0.65);
}
.el-radio{
  display: block;
}
</style>
