<template lang="pug">
  .cytoscape-toolbar(:class="[toolbarOption.orient]", :style="toolbarOption.style")
      slot(name="toolbar-before")
      template(v-for="item in filterToolbar")
        a.tool-btn(
          @click="toolbarClickHandler(item.name)"
        )
          svg-icon.tool-btn-icon(:icon-name="item.icon")
      slot(name="toolbar-after")
</template>
<script>
import { merge } from '../../common/util'
import svgIcon from './svg-icon.vue'
export default {
  name: 'cytoscape-toolbar',
  components: { svgIcon },
  props: {
    toolbar: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      defaultOption: {
        style: {},
        content: false,
        orient: 'horizontal'
      },
      toolbarList: [{
        icon: 'fit',
        name: 'fit',
        label: '适应屏幕'
      }, {
        icon: 'center',
        name: 'center',
        label: '回到中心'
      }, {
        icon: 'zoomin',
        name: 'zoomin',
        label: '放大'
      }, {
        icon: 'zoomout',
        name: 'zoomout',
        label: '缩小'
      }, {
        icon: 'download',
        name: 'download',
        label: '下载'
      }, {
        icon: 'fullscreen-enter',
        name: 'fullscreen',
        label: '全屏'
      }]
    }
  },
  computed: {
    toolbarOption () {
      return merge({}, this.defaultOption, this.toolbar || {})
    },
    filterToolbar () {
      if (this.toolbarOption) {
        if (this.toolbarOption.content === true) {
          return this.toolbarList
        } else if (Array.isArray(this.toolbarOption.content)) {
          return this.toolbarOption.content
            .map(name => this.toolbarList.find(item => item.name === name))
            .filter(tool => !!tool)
        }
      }
      return []
    }
  },
  methods: {
    toolbarClickHandler (type) {
      if (type === 'fullscreen') {
        const fullscreenItem = this.toolbarList[this.toolbarList.length - 1]
        fullscreenItem.icon = ~fullscreenItem.icon.indexOf('enter')
          ? 'fullscreen-exit'
          : 'fullscreen-enter'
      }
      this.$emit('eventHandler', type)
    }
  }
}
</script>
<style lang="less" scoped>
.cytoscape-toolbar{
    position: absolute;
    background: #FFF;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    z-index: 10;
    width: auto;
    padding: 8px;
    box-sizing: border-box;
    &.vertical{
      width: 36px;
      border-radius: 4px;
      z-index: 10;
      .tool-btn{
        margin: 10px auto;
        display: block;
      }
    }
    &.horizontal{
      height: 36px;
      .tool-btn{
        margin: 0 5px;
        display: inline-block;
      }
    }
    .tool-btn {
      line-height: 1.5;
      position: relative;
      display: inline-block;
      font-weight: 400;
      white-space: nowrap;
      text-align: center;
      background-image: none;
      -webkit-box-shadow: 0 2px 0 rgba(0,0,0,.015);
      box-shadow: 0 2px 0 rgba(0,0,0,.015);
      cursor: pointer;
      -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
      transition: all .3s cubic-bezier(.645,.045,.355,1);
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      box-sizing: border-box;
      border-radius: 4px;
      color: rgba(0,0,0,.55);
      background-color: #fff;
      border: none;
      outline: none;
      .tool-btn-icon{
        font-size: 18px;
      }
    }
}
</style>
