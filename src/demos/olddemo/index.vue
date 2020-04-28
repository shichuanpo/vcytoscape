<template lang="pug">
#app.cytoscape
  vcytoscape.cytoscape(ref="cytoscape", :option="option.cytoscape", :category="option.category", :data="graphData", @mouseover="createTippy", @ready="cytoscapeInit")
    template(v-slot:legend="scope")
      vcytoscape-legend(:data="scope.data", v-model="legendNodeModel", :option="option.nodeLegend", :category="scope.category")
      vcytoscape-legend(:data="scope.data", v-model="legendEdgeModel", type="edges", :option="option.edgeLegend", :category="scope.category")
    //- .navigator
  .cytoscape--container__loading(v-if="!option.cytoscape.layout.animate && layoutProgress < 1")
    .center(v-if="layoutProgress === 0")
      svg.circular(viewBox="25 25 50 50")
        circle.path(cx="50" cy="50" r="20" fill="none")
      .text 正在解析图谱，请稍后...
    .progress-bar(v-else)
      .progress-bar__outer
        .progress-bar__inner(:style="{width: progressText}")
      .text 正在计算布局，请稍后 {{progressText}}
</template>

<script>
import { createChildren, createData } from '../../mock'
import hospital from '../../assets/hospital.svg'
import person from '../../assets/person.svg'
import computer from '../../assets/computer.svg'
import clothes from '../../assets/clothes.svg'
import tippy from 'tippy.js'
import 'tippy.js/themes/light.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/themes/translucent.css'
export default {
  name: 'cytoscapePage',
  data () {
    return {
      layoutProgress: 0,
      tooltip: {},
      option: {
        nodeLegend: {
          show: true,
          formatter: str => {
            let translate = {
              hospital: '医院',
              clothes: '衣服',
              computer: '电脑',
              person: '个人'
            }
            Object.keys(translate).forEach(key => {
              str = str.replace(key, translate[key])
            })
            return str
          },
          orient: 'vertical',
          style: {
            padding: '10px',
            top: 0,
            left: 0
          },
          tagStyle: {
            borderWidth: '1px',
            borderStyle: 'solid'
          },
          inactiveTagStyle: {
            borderColor: '#ccc'
          }
        },
        edgeLegend: {
          show: true,
          style: {
            padding: '10px',
            top: 0,
            right: 0
          },
          tagStyle: {
            borderRadius: 0,
            borderWidth: 0,
            borderTopWidth: '2px',
            height: '0px',
            'line-height': '10px'
          },
          inactiveTagStyle: {
            borderColor: '#ccc',
            backgroundColor: 'none'
          },
          formatter: str => {
            let translate = {
              has: '拥有',
              love: '喜欢',
              goto: '去过'
            }
            Object.keys(translate).forEach(key => {
              str = str.replace(key, translate[key])
            })
            return str
          }
        },
        /****
 * 支持的基础edge样式(cytoscape不支持驼峰)
 */
        cytoscape: {
          style: [{
            selector: 'node',
            style: {
              'shape': 'round-rectangle'
            }
          }, {
            selector: 'node:parent',
            style: {
              'background-opacity': 0,
              'border-width': 0
            }
          }, {
            selector: 'edge',
            style: {
              width: 1,
              'curve-style': 'bezier',
              'target-arrow-shape': 'vee'
            }
          }, {
            selector: 'node[label]',
            style: {
              label: 'data(label)',
              'font-size': '9px',
              color: '#666',
              'z-index': 2
            }
          }, {
            selector: 'edge[label]',
            style: { 'font-size': '9px', color: '#626867', 'z-index': 1 }
          }],
          layout: {
            name: 'd3-force',
            animate: true,
            // maxIterations: 20,
            linkId: function id (d) {
              return d.id
            },
            linkDistance: 100,
            manyBodyStrength: -300,
            xX: 500,
            yY: 500,
            ready: function () {},
            stop: (e) => {
              this.layoutProgress = 1
              // console.log('layoutstop - ');
              // setTimeout(() => {
              //   e.cy.fit()
              // }, 100)
            }, // on layoutstop
            tick: (progress) => {
              this.layoutProgress = progress
              // console.log('progress - ', progress);
            },
            randomize: false,
            infinite: true
          } },
        contextMenus: {
          menuItems: [{
            id: 'nextlevel',
            content: `查询下一级`,
            selector: 'node',
            onClickFunction: (e) => {
              this.addNode(e)
            },
            disabled: false,
            show: true,
            hasTrailingDivider: false
          }]
        },
        tooltip: {
          trigger: 'mouseenter',
          content: function (e) {
            let target = e.target
            if (!target || target === e.cy) return
            if (target.isEdge()) {
              return `<div style="text-align: left"><div>名称： ${target.data('name')}</div><div>时间： ${target.data('time')}</div></div>`
            } else if (target.isNode()) {
              return `<div style="text-align: left"><div>id： ${target.data('id')}</div><div>position： ${target.position('x')}, ${target.position('y')}</div><div>renderedPosition： ${target.renderedPosition('x')}, ${target.renderedPosition('y')}</div><div>虚拟位置： ${target.data('x')}, ${target.data('y')}</div></div>`
            }
          },
          animation: 'fade',
          theme: 'light-border'
        },
        category: {
          nodes: {
            key: 'group',
            styles: {
              hospital: {
                'background-image': hospital,
                'background-width': '80%',
                'background-height': '80%',
                'background-repeat': 'no-repeat'
              },
              clothes: {
                'background-image': clothes,
                'background-width': '80%',
                'background-height': '80%',
                'background-repeat': 'no-repeat'
              },
              computer: {
                'background-image': computer,
                'background-width': '80%',
                'background-height': '80%',
                'background-repeat': 'no-repeat'
              },
              person: {
                'background-image': person,
                'background-width': '80%',
                'background-height': '80%',
                'background-repeat': 'no-repeat'
              }
            }
          },
          edges: [{
            name: 'love',
            matching: data => data.group === 'love',
            style: {
              'source-arrow-shape': 'vee',
              'line-style': 'dashed',
              'line-color': '#61a0a8',
              'width': 1
            }
          }, {
            name: 'goto',
            matching: data => data.group === 'goto',
            style: {
              'line-style': 'dashed',
              'line-color': '#2f4554',
              'width': 1
            }
          }, {
            name: 'has',
            matching: data => data.group === 'has',
            style: {
              'line-style': 'dashed',
              'line-color': '#c23531',
              'width': 1
            }
          }]
        }
      },
      graphData: [],
      legendNodeFilterId: '',
      legendEdgeFilterId: '',
      legendNodeModel: {},
      legendEdgeModel: {}
    }
  },
  computed: {
    progressText () {
      return (this.layoutProgress * 100).toFixed(1) + '%'
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
          }, this.legendNodeFilterId, true)
        } else {
          this.legendNodeFilterId && _cy.resetFilter(this.legendNodeFilterId, true)
        }
      } else {
        if (_categoryNames.length) {
          this.legendEdgeFilterId = _cy.filterByFunction((allEle) => {
            let _filterEdges = allEle.filter(ele => ele.isEdge() && !_categoryNames.includes(ele.data('group')))
            return allEle.filter(ele => _filterEdges.contains(ele) || _filterEdges.some(_edge => _edge.source() === ele || _edge.target() === ele))
          }, this.legendEdgeFilterId, true)
        } else {
          this.legendEdgeFilterId && _cy.resetFilter(this.legendEdgeFilterId, true)
        }
      }
    },
    cytoscapeInit (e) {
      e.cy.contextMenus(this.option.contextMenus)
    },
    addNode (e) {
      e.target.lock()
      let _targetId = e.target.id()
      let _children = createChildren(_targetId, 2)
      // _children.forEach(c => {
      //   c.data.parent = _targetId
      // })
      this.graphData = this.graphData.concat(_children)
      e.cy.delay(1000, function () {
        e.target.unlock()
      })
      // console.log('e.target.data = ', _datas)
    },
    createTippy (e) {
      if (!this.option.tooltip) {
        return
      }
      let element = e.target
      if (element === e.cy) return
      let content = Object.prototype.toString.call(this.option.tooltip.content) === '[object Function]' ? this.option.tooltip.content(e) : this.option.tooltip.content
      let tippyOpt = { content }
      Object.keys(this.option.tooltip).forEach(key => {
        if (key !== 'content' && key !== 'selector') {
          tippyOpt[key] = this.option.tooltip[key]
        }
      })
      if (this.tooltip[element.id()]) {
        this.tooltip[element.id()].setContent(content)
      } else {
        this.tooltip[element.id()] = tippy(element.popperRef(), tippyOpt)
      }
      setTimeout(() => {
        tippy.hideAll()
        this.tooltip[element.id()].show()
      }, 10)
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
.legend{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
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
</style>
