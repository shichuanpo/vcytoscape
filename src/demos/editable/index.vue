<template lang="pug">
#app.cytoscape
  vcytoscape.cytoscape(ref="cytoscape", :option="option", :category="category", :data="graphData")
    template(v-slot:legend="scope")
      vcytoscape-legend(:data="scope.data", v-model="legendNodeModel", :option="legend.nodes", :category="scope.category", @setting="settingHandler")
  transition(name="setting-fade")
    .right-container(v-if="settingVisible")
      header.header
        .title {{settingModel.title}}
        a.close(@click="settingVisible = false") ×
      section.body
        vcytoscape-setting(v-model="settingModel.form", :type="settingModel.type")
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
      legendEdgeModel: {},
      settingVisible: false,
      settingModel: {
        form: null,
        type: 'nodes'
      }
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
    settingHandler (item) {
      this.settingVisible = true
      this.settingModel.type = item.type
      this.settingModel.title = item.label
      if (item.type === 'nodes') {
        if (!this.category.nodes.styles[item.name]) {
          this.$set(this.category.nodes.styles, item.name, {})
        }
        this.settingModel.form = this.category.nodes.styles[item.name]
      } else {
        const edgeCategory = this.category[item.type].find(({ name }) => item.name === name)
        if (!edgeCategory.style) {
          this.$set(edgeCategory, 'style', {})
        }
        this.settingModel.form = edgeCategory.style
      }
    },
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
.right-container{
  width: 30%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  background: #fff;
  z-index: 1001;
  overflow: hidden;
  color: #72767b;
  box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
  display: flex;
  flex-direction: column;
  .header{
    height: 35px;
    line-height: 35px;
    padding: 0 5px;
    margin-bottom: 10px;
    .title{
      font-size: 16px;
      font-weight: 400;
    }
    .close{
      font-size: 25px;
      position: absolute;
      right: 15px;
      top: 10px;
      cursor: pointer;
    }
  }
  .body{
    flex: 1;
    overflow: auto;
  }
}
  .setting-fade-enter-active, .setting-fade-leave-active{
    transition: all .15s ease;
  }
  .setting-fade-enter, .setting-fade-leave-to{
    transform: translateX(100%);
  }
</style>
