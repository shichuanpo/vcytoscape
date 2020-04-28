<template lang="pug">
#app.cytoscape
  vcytoscape.cytoscape(ref="cytoscape", :option="option", :category="category", :data="graphData")
</template>

<script>
import { createData } from '../../mock'
import category from './category'
import option from './option'
export default {
  name: 'cytoscapePage',
  data () {
    return {
      graphData: [],
      category,
      option
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
</style>
