<template lang="pug">
  vue-legend(:data="legendData", :option="option", v-model="legendModel", @setting="settingHandler", :editable="editable")
</template>
<script>
import { merge, colorRgba } from '../common/util.js'
import { categoryOption } from '../config/index.js'
import { vueLegend } from 'vue-legend'
import mixin from '../mixins'
export default {
  name: 'vcytoscapeLegend',
  mixins: [mixin],
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
      isFullScreen: false,
      innerModel: {}
    }
  },
  computed: {
    editable () {
      return !!Object.entries(this.$listeners).find(([type]) => type === 'setting')
    },
    categoryInType () {
      return this.mergeCategorys && this.mergeCategorys[this.type]
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
      return this.categoryInType.map(({ name }) => {
        const { style, formatter } = this.categoryParams[name] || {}
        const { backgroundColor, backgroundImage, backgroundPosition, backgroundRepeat, backgroundSize, borderColor, borderStyle } = style
        return Object.assign({}, {
          activeTagStyle: { backgroundColor, borderColor },
          tagStyle: {
            backgroundPosition,
            backgroundImage,
            backgroundRepeat,
            backgroundSize,
            borderStyle
          },
          activeTextStyle: { color: style.borderColor || style.backgroundColor },
          formatter
        }, { name })
      })
    },
    categoryParams () {
      const _categoryParams = {}
      this.categoryInType.forEach(({ name, style, formatter }, _idx) => {
        const _baseIdx = _idx % categoryOption[this.type].styles.length
        _categoryParams[name] = _categoryParams[name] || {}
        _categoryParams[name].style = merge({}, categoryOption[this.type].styles[_baseIdx], style)
        _categoryParams[name].formatter = formatter
      })
      return this.getTransStyle(_categoryParams)
    }
  },
  methods: {
    settingHandler (item) {
      this.$emit('setting', {
        type: this.type,
        name: item.name,
        label: item.formatter ? item.formatter(item.name) : item.name
      })
    },
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
          'backgroundSize': 'contain',
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
    getFullscreen () {
      this.isFullScreen = document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement || false
    }
  },
  mounted () {
    window.addEventListener('resize', this.getFullscreen)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getFullscreen)
  }
}
</script>
<style lang="less", scoped>
.setting-fade-enter-active, .setting-fade-leave-active{
  transition: all .3s ease;
}
.setting-fade-enter, .setting-fade-leave-to{
  transform: translateX(100%);
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
</style>
