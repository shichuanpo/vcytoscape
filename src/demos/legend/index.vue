<template lang="pug">
#app.cytoscape
  vcytoscape.cytoscape(ref="cytoscape", :option="option", :category="category", :data="graphData")
  vcytoscape-legend(:data="graphData", v-model="legendNodeModel", :option="legend.nodes", :category="category")
  //- vcytoscape-legend(:data="graphData", v-model="legendEdgeModel", type="edges", :option="legend.edges", :category="category")
</template>

<script>
import { createData } from '../../mock'
import category from './category'
import option from './option'
import legend from './legend'
export default {
  name: 'cytoscapePage',
  data () {
    return {
      category,
      option,
      legend,
      graphData: [],
      legendNodeFilterId: '',
      legendEdgeFilterId: '',
      legendNodeModel: {},
      legendEdgeModel: {}
    }
  },
  watch: {
    legendNodeModel: {
      handler (newVal) {
        this.legendChange(newVal, 'nodes')
      },
      deep: true
    },
    legendEdgeModel: {
      handler (newVal) {
        this.legendChange(newVal, 'edges')
      },
      deep: true
    }
  },
  methods: {
    legendChange (legendModel, type) {
      let _cy = this.$refs.cytoscape
      let _categoryNames = Object.keys(legendModel).filter(key => !legendModel[key])
      if (type === 'nodes') {
        if (_categoryNames.length) {
          this.legendNodeFilterId = _cy.filterByFunction(allEle => {
            return allEle.filter(ele => ele.isEdge() || (ele.isNode() && !_categoryNames.includes(ele.data('group'))))
          }, this.legendNodeFilterId)
        } else {
          this.legendNodeFilterId && _cy.resetFilter(this.legendNodeFilterId)
        }
      } else {
        if (_categoryNames.length) {
          this.legendEdgeFilterId = _cy.filterByFunction((allEle) => {
            let _filterEdges = allEle.filter(ele => ele.isEdge() && !_categoryNames.includes(ele.data('group')))
            return allEle.filter(ele => _filterEdges.contains(ele) || _filterEdges.some(_edge => _edge.source() === ele || _edge.target() === ele))
          }, this.legendEdgeFilterId)
        } else {
          this.legendEdgeFilterId && _cy.resetFilter(this.legendEdgeFilterId)
        }
      }
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
