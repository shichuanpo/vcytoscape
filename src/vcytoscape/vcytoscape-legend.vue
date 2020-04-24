<template lang="pug">
  vue-legend(:data="legendData", :option="option", v-model="legendModel")
</template>
<script>
import { merge, isObject, isArray, isFunction, colorRgba } from './util'
import { categoryOption } from './config.js'
import { vueLegend } from 'vue-legend'
export default {
  name: 'vcytoscapeLegend',
  components: { vueLegend },
  props: {
    category: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    },
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    data: {
      type: [Array, Object],
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'nodes'
    },
    model: {
      type: Object
    }
  },
  model: {
    prop: 'model',
    event: 'change'
  },
  data () {
    return {
      innerModel: {}
    }
  },
  computed: {
    categoryInType () {
      return this.category && this.category[this.type]
    },
    legendModel: {
      get () {
        return merge({}, this.model || this.innerModel)
      },
      set (value) {
        this.innerModel = value
        this.$emit('change', value)
      }
    },
    legendData () {
      return this.categorys.map(name => {
        const { style, formatter } = this.categoryParams[name] || {}
        const { backgroundColor, backgroundImage, backgroundPosition, backgroundRepeat, backgroundSize, borderColor } = style
        return Object.assign({}, {
          activeTagStyle: { backgroundColor, backgroundImage, backgroundPosition, backgroundRepeat, backgroundSize, borderColor },
          tagStyle: {
            borderStyle: style.borderStyle
          },
          activeTextStyle: { color: style.borderColor || style.backgroundColor },
          formatter
        }, { name })
      })
    },
    categoryParams () {
      const _categoryParams = {}
      if (this.categoryInType) {
        if (isArray(this.categoryInType)) {
          /****
           * 分类配置为 { data: [{ name: '', style: {}, formatter: function () {}, matching: function () {} }] }
           * 其中formatter只用以legend
           */
          this.categoryInType.forEach(({ name, style, formatter }, _idx) => {
            const _baseIdx = _idx % categoryOption[this.type].styles.length
            _categoryParams[name] = _categoryParams[name] || {}
            _categoryParams[name].style = merge({}, categoryOption[this.type].styles[_baseIdx], style)
            _categoryParams[name].formatter = formatter
          })
        } else {
          const _styles = this.categoryInType.styles || {}
          if (isArray(_styles)) {
            /****
             * 分类配置为 { key: '', styles: [] }
             */
            this.categorys.forEach((name, _idx) => {
              const _optIdx = _idx % _styles.length
              const _baseIdx = _idx % categoryOption[this.type].styles.length
              _categoryParams[name] = _categoryParams[name] || {}
              _categoryParams[name].style = merge({}, categoryOption[this.type].styles[_baseIdx], _styles[_optIdx])
            })
          } else if (isObject(_styles)) {
            /****
             * 分类配置为 { key: '', styles: {} }
             */
            this.categorys.forEach((name, _idx) => {
              const _baseIdx = _idx % categoryOption[this.type].styles.length
              _categoryParams[name] = _categoryParams[name] || {}
              _categoryParams[name].style = merge({}, categoryOption[this.type].styles[_baseIdx], _styles[name] || {})
            })
          }
        }
      }
      return this.getTransStyle(_categoryParams)
    },
    /**
     * 统一data样式为Object
     */
    unifyData () {
      if (isArray(this.data)) {
        return {
          nodes: this.data.filter(dat => dat.group === 'nodes'),
          edges: this.data.filter(dat => dat.group === 'edges')
        }
      }
      return this.data
    },
    categorys () {
      const _categorys = Array.from(
        new Set((this.unifyData[this.type] || []).map(dat => this.dataByCategory(dat.data)).filter(g => !!g))
      )
      return _categorys
    },
    categoryBy () {
      if (this.categoryInType) {
        if (isArray(this.categoryInType)) {
          return this.categoryInType
        } else if (isObject(this.categoryInType)) {
          return this.categoryInType.key
        }
      }
      return null
    }
  },
  methods: {
    /****
     * 目前支持的样式有：背景颜色（透明度），背景图片，边框颜色，边框类型等
     * todo：shape、渐变等
     */

    getTransStyle (params) {
      const _isNodes = this.type === 'nodes'
      Object.keys(params).forEach(key => {
        params[key].style = {
          'backgroundColor': params[key].style['background-color'] ? colorRgba(params[key].style['background-color'], params[key].style['background-opacity'] || 1) : 'none',
          'backgroundImage': params[key].style['background-image'] ? `url(${params[key].style['background-image']})` : 'none',
          'backgroundPosition': 'center',
          'backgroundRepeat': params[key].style['background-repeat'],
          'backgroundSize': `${params[key].style['background-width']} ${params[key].style['background-height']}`,
          // 'borderWidth': _isNodes ? (params[key].style['border-width'] && params[key].style['border-width'] + 'px') || '1px' : (params[key].style['width'] && params[key].style['width'] + 'px') || '1px',
          'borderColor': _isNodes ? params[key].style['border-color'] : params[key].style['line-color'],
          'borderStyle': _isNodes ? params[key].style['border-style'] || 'not specified' : params[key].style['line-style'] || 'not specified'
        }
      })
      return params
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
    dataByCategory (data) {
      if (isArray(this.categoryBy)) {
        const _category = this.categoryBy.find(category => category.matching && category.matching(data))
        return _category ? (isFunction(_category.name) ? _category.name(data) : _category.name) : undefined
      } else {
        const keys = (this.categoryBy || '').split('.')
        return this.getDataFromKey(data, keys)
      }
    }
  }
}
</script>
