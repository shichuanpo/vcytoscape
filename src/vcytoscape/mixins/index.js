import { merge, isObject, isArray, isFunction, filterParams } from '../common/util'
export default {
  computed: {
    /**
     * 统一data样式为Object
     */
    unifyData () {
      if (isArray(this.data)) {
        return this.filterEdgeWithoutNode({
          nodes: this.data.filter(dat => dat.group === 'nodes'),
          edges: this.data.filter(dat => dat.group === 'edges')
        })
      }
      return this.filterEdgeWithoutNode(this.data)
    },
    mergeCategorys () {
      return {
        nodes: this.getCategoryByType('nodes'),
        edges: this.getCategoryByType('edges')
      }
    }
  },
  methods: {
    filterEdgeWithoutNode (data) {
      const nodes = data.nodes || []
      const nodeIds = nodes.map(({ data }) => data.id)
      const edges = (data.edges || []).filter(({ data }) => nodeIds.includes(data.source) && nodeIds.includes(data.target))
      return { nodes, edges }
    },
    getCategoryByType (type) {
      const _categorys = this.category[type] || {}
      let newCategorys = []
      if (isArray(_categorys)) {
        _categorys.forEach(({ name, matching, style, status, formatter }) => {
          (this.unifyData[type] || []).forEach(({ data }) => {
            if (matching && matching(data)) {
              const _name = isFunction(name) ? name(data) : name
              const exist = newCategorys.find(({ name }) => name === _name)
              if (!exist) {
                newCategorys.push({ name: _name, matching, style, status, formatter })
              }
            }
          })
        })
      } else if (isObject(_categorys)) {
        const keys = (_categorys.key || '').split('.')
        const _styles = _categorys.styles || {}
        const _status = _categorys.status || {}
        const names = Array.from(new Set(this.unifyData[type].map(({ data }) => this.getDataFromKey(data, keys))))
        newCategorys = names.map((name, idx) => {
          return {
            name,
            status: isArray(_status) ? _status[idx % _status.length] : _status[name],
            style: isArray(_styles) ? _styles[idx % _styles.length] : _styles[name],
            matching: data => this.getDataFromKey(data, keys) === name
          }
        })
      }
      return newCategorys.map(item => {
        return merge({}, item, { style: filterParams(((this.settingStyles && this.settingStyles[type]) || {})[item.name]) })
      })
    }
  }
}
