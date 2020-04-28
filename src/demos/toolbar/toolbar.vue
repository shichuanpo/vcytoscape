<template lang="pug">
  .cytoscape-toolbar(:class="[toolbarOption.orient]", :style="toolbarOption.style")
      template(v-for="item in filterToolbar")
        select(v-if="item.name==='layout'", v-model="layoutName")
          option(value="d3-force") 力导布局
          option(value="grid") 网格
          option(value="circle") 圆
          option(value="concentric") 同心圆
          option(value="breadthfirst") 广度优先
          option(value="random") 随机
        i.iconfont(v-else, :class="item.icon", :style="{'margin-right': toolbarOption.itemGap + 'px'}", @click="toolbarClickHandler(item.name)")
</template>
<script>
export default {
  name: 'cytoscape-toolbar',
  props: {
    toolbar: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      layoutName: '',
      defaultOption: {
        style: {
          'right': '10px',
          'top': '10px'
        },
        placement: 'bottom',
        content: true,
        orient: 'horizontal',
        itemGap: 5
      },
      toolbarList: [{
        icon: 'iconlayout',
        name: 'layout',
        label: '布局'
      }, {
        icon: 'icontarget',
        name: 'center',
        label: '回到中心'
      }, {
        icon: 'iconzoomin',
        name: 'zoomin',
        label: '放大'
      }, {
        icon: 'iconzoomout',
        name: 'zoomout',
        label: '缩小'
      }, {
        icon: 'icondownload',
        name: 'download',
        label: '下载'
      }, {
        icon: 'iconfullscreen',
        name: 'fullscreen',
        label: '全屏'
      }]
    }
  },
  computed: {
    toolbarOption () {
      return Object.assign({}, this.defaultOption, this.toolbar || {})
    },
    filterToolbar () {
      if (this.toolbarOption) {
        if (this.toolbarOption.content === true) {
          return this.toolbarList
        } else if (Array.isArray(this.toolbarOption.content)) {
          return this.toolbarList.filter(tool => !!this.toolbarOption.content.includes(tool.name))
        }
      }
      return []
    }
  },
  watch: {
    layoutName (name) {
      this.toolbarClickHandler('layout', name)
    }
  },
  methods: {
    toolbarClickHandler (type, layoutName) {
      this.$emit('eventHandler', type, layoutName)
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
    &.vertical{
      width: 32px;
      border-radius: 4px;
      z-index: 10;
      i{
        margin: 10px auto;
        display: block;
      }
    }
    &.horizontal{
      height: 36px;
      line-height: 36px;
      i{
        margin-left: 10px;
        display: inline-block;
      }
    }
    i {
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
      width: 24px;
      height: 24px;
      padding: 0;
      font-size: 14px;
      border-radius: 4px;
      color: rgba(0,0,0,.65);
      background-color: #fff;
      border: none;
      outline: none;
    }
}
.el-radio{
  display: block;
  margin: 5px;
}
</style>
