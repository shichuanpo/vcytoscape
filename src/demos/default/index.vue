<template lang="pug">
#app.cytoscape
  vcytoscape(ref="cytoscape", :option="option", :data="graphData")
</template>

<script>
import { createData } from '../../mock'
import option from './option'
export default {
  name: 'cytoscapePage',
  data () {
    return {
      layoutProgress: 0,
      option,
      graphData: []
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
