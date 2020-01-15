<template lang="pug">
  .cytoscape--container
    .cytoscape--container__graph(ref="cytoscapeBox")
</template>
<script>
import cytoscape from 'cytoscape'
import createEvents from './createEvents'
import { merge, mergeArrayConcat, isObject, isArray, isFunction, createId } from './util'
import { categoryOption, cytoscapeOption } from './config.js'
export default {
  name: 'vcytoscape',
  props: {
    option: {
      type: Object,
      default: () => {}
    },
    category: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      $cytoscapeInstance: null,
      events: [],
      cacheRandomIdMap: {},
      filters: {},
      $layout: null,
      $removeData: null
    }
  },
  computed: {
    nodesCategorys () {
      let _categorys = Array.from(
        new Set(this.data.filter(dat => dat.group === 'nodes').map(dat => this.dataByCategory(dat.data, 'nodes')).filter(g => !!g))
      )
      return _categorys
    },
    nodesCategoryBy () {
      if (this.category && this.category.nodes) {
        if (isArray(this.category.nodes)) {
          return this.category.nodes
        } else if (isObject(this.category.nodes)) {
          return this.category.nodes.key
        }
      }
      return null
    },
    edgesCategorys () {
      let _categorys = Array.from(
        new Set(this.data.filter(dat => dat.group === 'edges').map(dat => this.dataByCategory(dat.data, 'edges')).filter(g => !!g))
      )
      return _categorys
    },
    edgesCategoryBy () {
      if (this.category && this.category.edges) {
        if (isArray(this.category.edges)) {
          return this.category.edges
        } else if (isObject(this.category.edges)) {
          return this.category.edges.key
        }
      }
      return null
    },
    categoryNameToClass () {
      let _categoryNameToClass = {}
      this.nodesCategorys.forEach(key => {
        _categoryNameToClass[key] = this.getCacheRandomId(key, 'node_class_')
      })
      this.edgesCategorys.forEach(key => {
        _categoryNameToClass[key] = this.getCacheRandomId(key, 'edge_class_')
      })
      return _categoryNameToClass
    },
    styles () {
      let _categoryStyles = []
      if (this.category) {
        Object.keys(this.category).forEach(key => {
          const _option = this.category[key]
          const _defaultStyle = categoryOption[key].styles
          const _categorys = this[`${key}Categorys`]
          if (isArray(_option)) {
            /****
             * 分类配置为 { data: [{ name: '', style: {}, matching: function () {} }] }
             */
            _categoryStyles = _categoryStyles.concat(_option.map(({ name, style }, _idx) => {
              let _baseIdx = _idx % _defaultStyle.length
              return {
                selector: `.${this.categoryNameToClass[name]}`,
                style: merge({}, _defaultStyle[_baseIdx], style)
              }
            }))
          } else {
            const _styles = _option.styles || []
            if (_styles) {
              if (isArray(_styles)) {
                /****
                 * 分类配置为 { key: '', styles: [] }
                 */
                _categoryStyles = _categoryStyles.concat(_categorys.map((name, _idx) => {
                  let _optIdx = _idx % _styles.length
                  let _baseIdx = _idx % _defaultStyle.length
                  return {
                    selector: `.${this.categoryNameToClass[name]}`,
                    style: merge({}, _defaultStyle[_baseIdx], _styles[_optIdx])
                  }
                }))
              } else if (isObject(_styles)) {
                /****
                 * 分类配置为 { name: '', data: [] }
                 */
                _categoryStyles = _categoryStyles.concat(_categorys.map((name, _idx) => {
                  let _baseIdx = _idx % _defaultStyle.length
                  return {
                    selector: `.${this.categoryNameToClass[name]}`,
                    style: merge({}, _defaultStyle[_baseIdx], _styles[name] || {})
                  }
                }))
              }
            }
          }
        })
      }
      return _categoryStyles
    },
    cytoscapeOptions () {
      let _mergeOption = mergeArrayConcat({}, cytoscapeOption, {
        style: this.styles
      }, this.option || {})
      return _mergeOption
    }
  },
  watch: {
    data: {
      handler (newValue) {
        this.setData(newValue)
      },
      deep: true
    },
    cytoscapeOptions: {
      handler (newValue) {
        this.$cytoscapeInstance && this.setOptions(newValue)
      },
      deep: true
    }
  },
  methods: {
    getCacheRandomId (key, salt, num) {
      this.cacheRandomIdMap[key] = this.cacheRandomIdMap[key] || createId(salt, num)
      return this.cacheRandomIdMap[key]
    },
    dataByCategory (data, type) {
      if (isArray(this[`${type}CategoryBy`])) {
        let _category = this[`${type}CategoryBy`].find(category => category.matching && category.matching(data))
        return _category ? (isFunction(_category.name) ? _category.name(data) : _category.name) : undefined
      } else {
        return data[this[`${type}CategoryBy`]]
      }
    },
    getDataWithClasses (data) {
      const _data = JSON.parse(JSON.stringify(data || []))
      return _data.map(_item => {
        let _categoryName = this.dataByCategory(_item.data, _item.group)
        _item.classes = _item.classes || []
        _categoryName &&
        !_item.classes.includes(this.categoryNameToClass[_categoryName]) &&
        _item.classes.push(this.categoryNameToClass[_categoryName])
        return _item
      })
    },
    getAllElements () {
      return this.$cytoscapeInstance &&
          (this.$cytoscapeInstance.elements().merge(this.$removeData || this.$cytoscapeInstance.collection()))
    },
    /****
     * cytoscape option设置只有拆分的放法
     */
    setOptions: function (option) {
      if (!this.$cytoscapeInstance) return
      this.$cytoscapeInstance.startBatch()
      Object.keys(option).forEach(key => this.$cytoscapeInstance[key] && this.$cytoscapeInstance[key](option[key]))
      this.$cytoscapeInstance.endBatch()
      this.reLayout()
    },
    /****
     * cytoscape并不支持数据重置，
     * 所以手动了一个方法
     */
    setData (data) {
      let _dataWithClasses = this.getDataWithClasses(data)
      if (!this.$cytoscapeInstance) return this.createCytoscape(_dataWithClasses)
      this.$cytoscapeInstance.startBatch()
      // 图中不存在的数据清除
      let _allElements = this.getAllElements()
      let _removeEles = _allElements.filter(ele => !_dataWithClasses.some(item => ele.id() === item.data.id))
      this.$cytoscapeInstance.remove(_removeEles)
      let _addData = []
      _dataWithClasses.forEach(_data => {
        let _eleIn = _allElements.$id(_data.data.id)
        if (!_eleIn || !_eleIn.length) { // 添加到图中
          _addData.push(_data)
        } else if (_eleIn.isNode()) { // 已有数据更新
          let _keys = Object.keys(_data)
          let _keysLength = _keys.length
          for (let i = 0; i < _keysLength; i++) {
            let key = _keys[i]
            console.log('key = ', key)
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
      let _option = merge({}, this.cytoscapeOptions, {
        container: this.$refs.cytoscapeBox,
        elements: data || []
      })
      delete _option.layout
      this.$cytoscapeInstance = cytoscape(_option)
      // register all the component events as cytoscape
      this.events = this.events.concat(createEvents(this.$cytoscapeInstance))
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
      let _randomId = id || createId('func')
      this.filters[_randomId] = func
      this.renderFilter(relayout)
      return _randomId
    },
    renderFilter: function (relayout) {
      if (!this.$cytoscapeInstance) return
      this.$cytoscapeInstance.startBatch()
      let _allElements = this.getAllElements()
      let _filterElements = _allElements
      Object.keys(this.filters).forEach(key => {
        _filterElements = this.filters[key](_filterElements)
      })
      let _filterNodes = _filterElements.nodes()
      let _filterEdges = _filterElements.edges().filter(ele => {
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
    this.setData(this.data)
  },
  beforeDestroy () {
    this.destroy()
  }
}
</script>
<style lang="less" scoped>
.cytoscape--container {
  text-align: left;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
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
