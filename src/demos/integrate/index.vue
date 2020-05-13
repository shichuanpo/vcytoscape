<template lang="pug">
.cytoscape
  vcytoscape.cytoscape(ref="cytoscape", :option="cytoscapeOption", :category="category", :toolbar="toolbarOption", :data="graphData", @mouseover="createTippy")
    template(v-slot:legend="scope")
      vcytoscape-legend(:data="scope.data", v-model="legendNodeModel", :option="legend.nodes", :category="scope.category", editable)
      vcytoscape-legend(:data="scope.data", v-model="legendEdgeModel", type="edges", :option="legend.edges", :category="scope.category", editable)
    template(v-slot:toolbar-before="scope")
      el-popover(
        placement="bottom",
        trigger="hover"
      )
        el-radio(v-model="layout", v-for="l in layoutList", :key="l.name", :label="l.name") {{l.label}}
        i.el-icon-s-grid(slot="reference")
  filter-panel(v-model="filters")
</template>

<script>
import category from './category'
import option from './option'
import legend from './legend'
import data from '../../mock'
import filterPanel from './filterPanel'
import tippy, { hideAll } from 'tippy.js'
import 'tippy.js/themes/material.css'
export default {
  name: 'cytoscapePage',
  components: { filterPanel },
  data () {
    return {
      category,
      option,
      legend,
      layoutProgress: 0,
      tooltip: {},
      layoutList: [{
        name: 'd3-force',
        label: 'd3力导'
      }, {
        name: 'cola',
        label: 'cola力导'
      }, {
        name: 'klay',
        label: '有向图'
      }, {
        name: 'random',
        label: '随机'
      }, {
        name: 'grid',
        label: '网格'
      }, {
        name: 'circle',
        label: '圆'
      }, {
        name: 'concentric',
        label: '同心圆'
      }, {
        name: 'breadthfirst',
        label: '广度优先'
      }],
      layout: 'd3-force',
      toolbarOption: {
        content: true,
        // orient: 'vertical',
        style: {
          top: '10px',
          right: '110px'
        }
      },
      tooltipOption: {
        trigger: 'mouseenter',
        content: (e) => {
          const transMap = {
            belong: '阵营归属',
            participate: '参与活动',
            workload: '强度',
            email: '邮箱',
            age: '年龄',
            sex: '性别',
            female: '女性',
            male: '男性',
            interest: '爱好',
            eat: '吃货',
            sing: '唱歌',
            draw: '画画',
            versify: '作诗',
            code: '撸代码',
            outdoors: '户外活动',
            dance: '跳舞',
            drive: '飙车',
            game: '玩游戏',
            marriage: '感情状况',
            married: '已婚',
            inlove: '恋爱中',
            none: '未婚',
            name: '名称',
            id: '编号',
            type: '类型',
            address: '地址',
            startTime: '启动时间',
            version: '版本',
            department: '阵营',
            product: '活动'
          }
          let target = e.target
          if (!target || target === e.cy) { return }
          let propdata = target.data('properties') || target.data()
          if (target.isNode()) {
            return Object.keys(propdata).map(key => {
              let _data = Array.isArray(propdata[key])
                ? propdata[key].map(_item => transMap[_item] || _item).join(',')
                : (transMap[propdata[key]] || propdata[key])
              return `<div style="text-align: left;color: #eee;"><div>${transMap[key] || key}： ${_data}</div></div>`
            }).join('')
          } else {
            let workload = propdata.workload
              ? `<div style="text-align: left;color: #eee;"><div>工作量： ${propdata.workload}</div></div>`
              : ''
            return `<div style="text-align: left;color: #eee;"><div>类型： ${transMap[propdata.type] || propdata.type}</div></div>${workload}`
          }
        },
        animation: 'fade',
        delay: 0,
        theme: 'material'
      },
      graphData: [],
      legendNodeFilterId: '',
      legendEdgeFilterId: '',
      legendNodeModel: {},
      legendEdgeModel: {},
      filters: {},
      filtersId: ''
    }
  },
  computed: {
    cytoscapeOption () {
      const _layout = Object.assign({}, option.layout, { name: this.layout })
      let _option = Object.assign({}, option, { layout: _layout })
      return _option
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
    },
    filters: {
      handler (newVal) {
        this.filterChange(newVal)
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
            return allEle.filter(ele => ele.isEdge() || (ele.isNode() && !_categoryNames.includes(ele.data('type'))))
          }, this.legendNodeFilterId, true)
        } else if (this.legendNodeFilterId) {
          _cy.resetFilter(this.legendNodeFilterId, true)
        }
      } else {
        if (_categoryNames.length) {
          let _categoryMatchings = _categoryNames.map(name => category.edges.find(item => name === item.name).matching)
          this.legendEdgeFilterId = _cy.filterByFunction((allEle) => {
            let _filterEdges = allEle.filter(ele => ele.isEdge() && !_categoryMatchings.some(func => func(ele.data())))
            return allEle.filter(ele => {
              return _filterEdges.contains(ele) ||
                _filterEdges.some(_edge => _edge.source() === ele || _edge.target() === ele)
            })
          }, this.legendEdgeFilterId, true)
        } else if (this.legendEdgeFilterId) {
          _cy.resetFilter(this.legendEdgeFilterId, true)
        }
      }
    },
    filterChange (filter) {
      let _cy = this.$refs.cytoscape
      this.filtersId = _cy.filterByFunction(allEle => {
        return allEle.filter(ele => {
          return Object.keys(this.filters).every(key => {
            let matched = false
            const filter = this.filters[key]
            const propVal = (ele.data('properties') || {})[key]
            switch (key) {
              case 'sex':
              case 'marriage':
                matched = ele.isEdge() || !propVal || filter.some(val => val === propVal)
                break
              case 'age':
                let min = filter[0] || 0
                let max = filter[1] || Infinity
                matched = ele.isEdge() || !propVal || (propVal >= min && propVal < max)
                break
              case 'interest':
                matched = ele.isEdge() || !propVal || filter.some(item => {
                  return propVal.includes(item)
                })
                break
              case 'workload':
                let connectedEdges = allEle.edges(edge => edge.source() === ele || edge.target() === ele)
                if (ele.isNode() && ele.data('type') === 'person') {
                  let min = filter[0] || 0
                  let max = filter[1] < 1 ? filter[1] || 1 : Infinity
                  let workload = connectedEdges.reduce((total, current) => {
                    let _workload = current.data('workload') || 0
                    return total + _workload
                  }, 0)
                  matched = workload >= min && workload < max
                } else {
                  matched = true
                }
                break
              default:
                matched = false
                break
            }
            return matched
          })
        })
      }, this.filtersId, true)
    },
    createTippy (e) {
      hideAll()
      if (!this.tooltipOption) {
        return
      }
      let element = e.target
      if (element === e.cy) { return }
      let content = Object.prototype.toString.call(this.tooltipOption.content) === '[object Function]'
        ? this.tooltipOption.content(e)
        : this.tooltipOption.content
      let ref = element.popperRef()
      let tippyOpt = {
        onCreate: instance => { instance.popperInstance.reference = ref },
        lazy: false,
        content: content
      }
      Object.keys(this.tooltipOption).forEach(key => {
        if (key !== 'content' && key !== 'selector') {
          tippyOpt[key] = this.tooltipOption[key]
        }
      })
      if (this.tooltip[element.id()]) {
        this.tooltip[element.id()].setContent(content)
      } else {
        let dummyDomEle = document.createElement('div')
        this.tooltip[element.id()] = tippy(dummyDomEle, tippyOpt)
      }
      this.tooltip[element.id()].show()
    }
  },
  mounted () {
    setTimeout(() => {
      this.graphData = data
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
  background: #fff;
}

// .navigator{
//   position: absolute;
//   width: 100px;
//   height: 100px;
//   right: 0;
//   bottom: 0;
//   border: 1px solid #ccc;
// }
.cytoscape--container__loading{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 2000;
    background: #fff;
    .progress-bar{
      top: 50%;
      margin-top: -15px;
      left: 20%;
      width: 60%;
      text-align: center;
      position: absolute;
      overflow: hidden;
      .progress-bar__outer{
        width: 100%;
        border-radius: 100px;
        margin: 16px 0;
        height: 10px;
        background-color: #ebeef5;
        overflow: hidden;
        position: relative;
        vertical-align: middle;
        .progress-bar__inner{
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background-color: #409eff;
          text-align: right;
          border-radius: 100px;
          line-height: 1;
          white-space: nowrap;
        }
      }
    }
    .center{
      top: 50%;
      margin-top: -21px;
      width: 100%;
      text-align: center;
      position: absolute;
      .circular{
        height: 42px;
        width: 42px;
        animation: loading-rotate 2s linear infinite;
        .path {
          animation: loading-dash 1.5s ease-in-out infinite;
          stroke-dasharray: 90,150;
          stroke-dashoffset: 0;
          stroke-width: 2;
          stroke: #409eff;
          stroke-linecap: round;
        }
      }
    }
  }
  .el-icon-s-grid{
    display: inline-block;
    margin: 0 5px;
    text-align: center;
    color: rgba(0,0,0,.65);
    font-size: 14px;
  }
  .el-radio{
    display: block;
    margin: 5px;
  }
</style>
