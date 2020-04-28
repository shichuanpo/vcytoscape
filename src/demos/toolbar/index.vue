<template lang="pug">
#app.cytoscape
  vcytoscape.cytoscape(ref="cytoscape", :option="option", :category="category", :data="graphData", @ready="cyInit")
  toolbar(@eventHandler="toolbarClickHandler")
</template>

<script>
import { createData } from '../../mock'
import category from './category'
import option from './option'
import toolbar from './toolbar'
export default {
  name: 'cytoscapePage',
  components: { toolbar },
  data () {
    return {
      category,
      option,
      graphData: [],
      legendNodeFilterId: '',
      legendEdgeFilterId: '',
      legendNodeModel: {},
      legendEdgeModel: {},
      $cytoscapeInstance: null
    }
  },
  methods: {
    cyInit (e) {
      this.$cytoscapeInstance = e.cy
    },
    toolbarClickHandler (type, layoutName) {
      const func = this[type + 'Handler']
      func && func(layoutName)
    },
    layoutHandler (layoutName) {
      option.layout.name = layoutName
    },
    centerHandler () {
      if (this.$cytoscapeInstance) {
        this.$cytoscapeInstance.animate({
          center: this.$cytoscapeInstance.$(),
          duration: 100
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
          this.$cytoscapeInstance.animate({
            duration: 50,
            zoom: {
              level: _nzoom,
              renderedPosition
            } })
        }
      }
    },
    zoominHandler (increment = 0.2) {
      this.zoomChange(increment)
    },
    zoomoutHandler (increment = -0.2) {
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
      } else {
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
</style>
