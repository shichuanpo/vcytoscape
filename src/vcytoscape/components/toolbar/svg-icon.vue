<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="svgName"></use>
  </svg>
</template>
<script>
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../../assets/svgs', false, /\.svg$/)
requireAll(req)
export default {
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      default: ''
    },
    className: {
      type: String
    }
  },
  computed: {
    svgName () {
      return `#icon-${this.iconName}`
    }
  }
}
</script>
<style scoped>
.svg-icon {
  fill: currentColor;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
