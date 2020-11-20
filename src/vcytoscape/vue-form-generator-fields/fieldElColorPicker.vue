
<template lang="pug">
  el-color-picker(
    popper-class="color-picker",
    v-model="value",
    :disabled="disabled",
    :readonly="schema.readonly",
    :show-alpha="schema.showAlpha",
    size="small"
  )
</template>
<script>
import { abstractField } from 'vue-form-generator'
import { ColorPicker } from 'element-ui'
import 'element-ui/lib/theme-chalk/color-picker.css'
// import 'element-ui/lib/theme-chalk/button.css'
// import 'element-ui/lib/theme-chalk/input.css'
export default {
  name: 'fieldElColorPicker',
  mixins: [ abstractField ],
  components: { elColorPicker: ColorPicker }
}
</script>
<style lang='less'>
.color-picker {
  .el-button--text {
    padding: 0 15px;
    line-height: 26px;
    border: none;
    background: transparent;
    &, &:focus {
      outline: none;;
    }
  }
  .el-input__inner {
    padding: 2px 8px;
    line-height: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: all 0.3s;
    &:focus {
      border-color: #01acf3;
      outline: none;
    }
  }
}
</style>
