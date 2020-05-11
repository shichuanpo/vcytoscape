<template lang="pug">
  .cytoscape--container
    .cytoscape--container__graph(ref="cytoscapeBox")
    slot(:data="data", :category="mergeCategorys", name="legend")
    toolbar(:toolbar="toolbar", :data="data", :category="category", @eventHandler="toolbarClickHandler")
      template(v-slot:toolbar-before)
        slot(name="toolbar-before", :data="data", :category="category")
      template(v-slot:toolbar-after)
        slot(name="toolbar-after", :data="data", :category="category")
    transition(name="setting-fade")
      setting-form(
        v-if="settingParams.visible",
        v-model="settingStyle",
        @close="settingParams.visible=false",
        :type="settingParams.type",
        :title="settingParams.title",
      )
</template>
<script>
import cytoscape from 'cytoscape'
import toolbar from './toolbar'
import createEvents from '../common/createEvents'
import settingForm from './setting-form'
import { bus } from '../common/eventBus'
import { merge, mergeArrayConcat, createId, debounce } from '../common/util'
import { categoryOption, cytoscapeOption } from '../config'
import mixin from '../mixins'
export default {
  name: 'vcytoscape',
  mixins: [mixin],
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    category: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: [Array, Object],
      default: () => ([])
    },
    toolbar: {
      type: Object,
      required: false
    },
    behavior: {
      type: [String, Boolean],
      default: true
    }
  },
  components: { toolbar, settingForm },
  data () {
    return {
      layoutName: '',
      $cytoscapeInstance: null,
      events: [],
      cacheRandomIdMap: {},
      filters: {},
      $layout: null,
      $removeData: null,
      oldLayout: null,
      settingStyles: {
        nodes: {},
        edges: {}
      },
      settingParams: {
        type: 'nodes',
        title: '',
        name: '',
        visible: false
      }
    }
  },
  computed: {
    categoryNameToClass () {
      const _categoryNameToClass = {}
      this.mergeCategorys.nodes.forEach(({ name }) => {
        _categoryNameToClass[`nodes_${name}`] = this.getCacheRandomId(`nodes_${name}`, 'node_class_')
      })
      this.mergeCategorys.edges.forEach(({ name }) => {
        _categoryNameToClass[`edges_${name}`] = this.getCacheRandomId(`edges_${name}`, 'edge_class_')
      })
      return _categoryNameToClass
    },
    settingStyle: {
      get () {
        return ((this.settingStyles[this.settingParams.type] || {})[this.settingParams.name]) || {}
      },
      set (val) {
        this.settingStyles = this.settingStyles || {}
        this.settingStyles[this.settingParams.type] = this.settingStyles[this.settingParams.type] || {}
        this.$set(this.settingStyles[this.settingParams.type], this.settingParams.name, val)
      }
    },
    categoryConfig () {
      let _categoryStyles = []
      const _categoryStatus = {}
      if (this.category) {
        Object.keys(this.category).forEach(key => {
          const _defaultStyle = categoryOption[key].styles
          const _categorys = this.mergeCategorys[key]
          _categoryStyles = _categoryStyles.concat(_categorys.map(({ name, style, status }, _idx) => {
            const _baseIdx = _idx % _defaultStyle.length
            _categoryStatus[key + '_' + name] = status
            return {
              selector: `.${this.categoryNameToClass[key + '_' + name]}`,
              style: merge({}, _defaultStyle[_baseIdx], style)
            }
          }))
        })
      }
      return {
        styles: _categoryStyles,
        status: _categoryStatus
      }
    },
    cytoscapeOptions () {
      const layout = this.layoutName ? { layout: { name: this.layoutName } } : {}
      const _mergeOption = mergeArrayConcat({}, cytoscapeOption, this.option || {}, {
        style: this.categoryConfig.styles
      }, layout)
      return _mergeOption
    }
  },
  watch: {
    unifyData: {
      handler (newValue) {
        this.setData(newValue)
      },
      deep: true
    },
    cytoscapeOptions: {
      handler (newValue) {
        const reLayout = (this.oldLayout || {}).name !== (newValue.layout || {}).name
        this.oldLayout = newValue.layout
        this.$cytoscapeInstance && this.setOptions(newValue, reLayout)
      },
      deep: true
    },
    settingStyle: {
      handler (newValue) {
        this.$emit('setting:category', {
          name: this.settingParams.name,
          category: this.mergeCategorys
        })
      },
      deep: true
    }
  },
  methods: {
    settingHandler ({ label, type, name }) {
      const { style } = this.categoryConfig.styles.find(({ selector }) => selector === `.${this.categoryNameToClass[type + '_' + name]}`) || {}
      this.$set(this, 'settingParams', {
        title: `${type === 'nodes' ? '节点' : '边'}(${label})`,
        type,
        visible: true,
        name
      })
      this.settingStyle = style || {}
    },
    toolbarClickHandler (type, layoutName) {
      const func = this[type + 'Handler']
      func && func(layoutName)
    },
    layoutHandler (layoutName) {
      this.layoutName = layoutName || ''
    },
    centerHandler () {
      if (this.$cytoscapeInstance) {
        this.debounceAnimate({
          center: this.$cytoscapeInstance.$()
        })
      }
    },
    getMaxMinZoom () {
      return this.$cytoscapeInstance ? {
        min: this.$cytoscapeInstance.minZoom(),
        max: this.$cytoscapeInstance.maxZoom()
      } : {}
    },
    zoomChange (increment) {
      if (this.$cytoscapeInstance) {
        const zoomRange = this.getMaxMinZoom()
        let zoom = this.$cytoscapeInstance.zoom()
        let _nzoom = zoom + increment
        const { x1, x2, y1, y2 } = this.$cytoscapeInstance.$().renderedBoundingBox()
        const renderedPosition = {
          x: (x2 + x1) / 2,
          y: (y2 + y1) / 2
        }
        if (_nzoom >= zoomRange.min && _nzoom <= zoomRange.max) {
          this.debounceAnimate({
            zoom: {
              level: _nzoom,
              renderedPosition
            }
          })
        }
      }
    },
    debounceAnimate: debounce(function (option) {
      this.$cytoscapeInstance.animate(Object.assign({}, option, { duration: 50 }))
    }, 50, this),
    zoominHandler (increment = 0.5) {
      this.zoomChange(increment)
    },
    zoomoutHandler (increment = -0.5) {
      this.zoomChange(increment)
    },
    downloadHandler () {
      if (!this.$cytoscapeInstance) return
      const image = this.$cytoscapeInstance.png({ bg: '#fff', full: true, maxWidth: 10000, maxHeight: 10000 })
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = '关系图'
      a.href = image
      a.dispatchEvent(event)
    },
    isFullscreen () {
      return document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement || false
    },
    fullscreenHandler () {
      if (this.isFullscreen()) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else { // 否则，进入全屏
        const element = this.$el
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
    },
    getCacheRandomId (key, salt, num) {
      this.cacheRandomIdMap[key] = this.cacheRandomIdMap[key] || createId(salt, num)
      return this.cacheRandomIdMap[key]
    },
    getDataFromKey (data, keys) {
      if (!keys || keys.length < 1) {
        return data
      } else if (keys.length === 1) {
        return data[keys[0]]
      } else {
        const key = keys.shift()
        return this.getDataFromKey(data[key] || {}, keys)
      }
    },
    getDataWithClassesFromType (item, type = 'nodes') {
      const { name } = this.mergeCategorys[type].find(({ matching, name }) => matching(item.data)) || {}
      item.classes = item.classes || []
      merge(item, this.categoryConfig.status[type + '_' + name])
      name && item.classes.push(this.categoryNameToClass[type + '_' + name])
      return item
    },
    getDataWithClasses (data) {
      const { nodes, edges } = JSON.parse(JSON.stringify(data || {}))
      return nodes.map(_item => this.getDataWithClassesFromType(_item, 'nodes'))
        .concat(
          edges.map(_item => this.getDataWithClassesFromType(_item, 'edges'))
        )
    },
    getAllElements () {
      return this.$cytoscapeInstance &&
          (this.$cytoscapeInstance.elements().merge(this.$removeData || this.$cytoscapeInstance.collection()))
    },
    /****
     * cytoscape option设置只有拆分的放法
     */

    setOptions: function (option, reLayout) {
      if (!this.$cytoscapeInstance) return
      this.$cytoscapeInstance.startBatch()
      Object.keys(option).forEach(key => {
        this.$cytoscapeInstance[key] && this.$cytoscapeInstance[key](option[key])
      })
      this.$cytoscapeInstance.endBatch()
      reLayout && this.reLayout()
    },
    /****
     * cytoscape并不支持数据重置，
     * 所以手动了一个方法
     */
    setData (data) {
      const _dataWithClasses = this.getDataWithClasses(data)
      if (!this.$cytoscapeInstance) return this.createCytoscape(_dataWithClasses)
      this.$cytoscapeInstance.startBatch()
      // 图中不存在的数据清除
      const _allElements = this.getAllElements()
      const _removeEles = _allElements.filter(ele => !_dataWithClasses.some(item => ele.id() === item.data.id))
      this.$cytoscapeInstance.remove(_removeEles)
      const _addData = []
      _dataWithClasses.forEach((_data, idx) => {
        const _eleIn = _allElements.$id(_data.data.id)
        if (!_eleIn || !_eleIn.length) { // 添加到图中
          _addData.push(_data)
        } else { // 已有数据更新
          const _keys = Object.keys(_data)
          const _keysLength = _keys.length
          for (let i = 0; i < _keysLength; i++) {
            const key = _keys[i]
            switch (key) {
              /**
               * 与布局，分类等有冲突的属性不允许更新
               */
              // case 'position':
              // case 'renderedPosition':
              // case 'relativePosition':
              // case 'classes':
              //   break;
              case 'data':
                if (JSON.stringify(_eleIn.data()) !== JSON.stringify(_data.data)) {
                  _eleIn.data(_data.data)
                }
                break
              case 'selected':
                _data.selected ? _eleIn.select() : _eleIn.unselect()
                break
              case 'selectable':
                _data.selectable ? _eleIn.selectify() : _eleIn.unselectify()
                break
              case 'locked':
                _data.locked ? _eleIn.lock() : _eleIn.unlock()
                break
              case 'grabbable':
                _data.grabbable ? _eleIn.grabify() : _eleIn.ungrabify()
                break
              case 'pannable':
                _data.pannable ? _eleIn.panify() : _eleIn.unpanify()
                break
            }
          }
        }
      })
      this.$cytoscapeInstance.add(_addData)
      this.$cytoscapeInstance.endBatch()
      this.renderFilter()
      this.reLayout()
    },
    createCytoscape (data) {
      const _option = merge({}, this.cytoscapeOptions, {
        container: this.$refs.cytoscapeBox,
        elements: data || []
      })
      /**
       * cytoscape init layout跟手动layout有差异，zoom会变化，暂不清楚原因
       */
      _option.layout = { name: 'null' }
      this.$cytoscapeInstance = cytoscape(_option)
      if (this.behavior) {
        this.events = this.events.concat(createEvents(this.$cytoscapeInstance))
      }
      for (const [eventType, callback] of Object.entries(this.$listeners)) {
        const func = function (event) {
          callback(event)
        }
        this.$cytoscapeInstance.on(eventType, func)
        this.events.push(() => {
          this.$cytoscapeInstance.off(eventType, func)
        })
      }
      this.$cytoscapeInstance.ready()
      /**
       * 方便控制停止布局
       */
      data && data.length && this.reLayout()
    },
    reLayout () {
      this.$layout && this.$layout.stop()
      this.$layout = this.$cytoscapeInstance.layout(this.cytoscapeOptions.layout)
      this.$layout.run()
    },
    async destroy () {
      this.$layout && this.$layout.stop()
      if (this.$cytoscapeInstance) {
        await this.events.forEach(func => {
          func()
        })
        this.events = []
        await this.$cytoscapeInstance.destroy()
      }
      this.filters = {}
      this.$removeData = null
    },
    resetFilter (id, relayout) {
      if (id) {
        delete this.filters[id]
      } else {
        this.filters = {}
      }
      this.renderFilter(relayout)
    },
    filterByFunction (func, id, relayout) {
      const _randomId = id || createId('func')
      this.filters[_randomId] = func
      this.renderFilter(relayout)
      return _randomId
    },
    renderFilter: function (relayout) {
      if (!this.$cytoscapeInstance) return
      this.$cytoscapeInstance.startBatch()
      const _allElements = this.getAllElements()
      let _filterElements = _allElements
      Object.keys(this.filters).forEach(key => {
        _filterElements = this.filters[key](_filterElements)
      })
      const _filterNodes = _filterElements.nodes()
      const _filterEdges = _filterElements.edges().filter(ele => {
        return _filterNodes.contains(ele.target()) && _filterNodes.contains(ele.source())
      })
      _filterElements = _filterNodes.merge(_filterEdges)
      this.$removeData = _allElements.difference(_filterElements)
      this.$cytoscapeInstance.remove(this.$removeData)
      this.$cytoscapeInstance.add(_filterElements)
      this.$cytoscapeInstance.endBatch()
      relayout && this.reLayout()
      this.$cytoscapeInstance.emit('update') // 自定义事件 update
      return _filterElements
    }
  },
  mounted () {
    this.setData(this.unifyData)
    bus.$on('setting', this.settingHandler)
  },
  beforeDestroy () {
    this.destroy()
    bus.$off('setting', this.settingHandler)
  }
}
</script>
<style lang="less" scoped>
.setting-fade-enter-active, .setting-fade-leave-active{
  transition: all .15s ease;
}
.setting-fade-enter, .setting-fade-leave-to{
  transform: translateX(100%);
}
.cytoscape--container {
  text-align: left;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  .cytoscape--container__graph, .cytoscape--container__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .text{
      padding: 10px;
    }
  }
}
</style>
