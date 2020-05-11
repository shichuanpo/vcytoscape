
<template lang="pug">
  el-color-picker(
    v-model="value",
    :disabled="disabled",
    :readonly="schema.readonly",
    show-alpha,
    size="small"
  )
</template>
<script>
import { abstractField } from 'vue-form-generator'
import { ColorPicker } from 'element-ui'
import 'element-ui/lib/theme-chalk/color-picker.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/input.css'
export default {
  name: 'fieldElColorPicker',
  mixins: [ abstractField ],
  components: { elColorPicker: ColorPicker }
}
</script>
