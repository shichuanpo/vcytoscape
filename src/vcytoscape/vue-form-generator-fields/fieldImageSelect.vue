
<template lang="pug">
  .image-box(:style="imageBoxStyle")
    .add(v-if="!hasImage") +
    template(v-else)
      a.remove(@click="removeImage") -
    input(
      ref="ImageSelectRef",
      accept=".jpg, .jpeg, .png, .svg",
      type="file",
      :disabled="disabled",
      @input="imageChange",
      :readonly="schema.readonly"
    )
</template>
<script>
import { abstractField } from 'vue-form-generator'
export default {
  name: 'ImageSelect',
  mixins: [ abstractField ],
  methods: {
    imageChange (fileObj) {
      if (fileObj.target.files && fileObj.target.files[0]) {
        this.value = URL.createObjectURL(fileObj.target.files[0])
      }
    },
    removeImage () {
      this.value = 'none'
      this.$refs.ImageSelectRef.value = ''
    }
  },
  computed: {
    imageBoxStyle () {
      const base = {
        backgroundPosition: 'center',
        backgroundSize: 'contain'
      }
      if (this.value) {
        base.backgroundImage = `url(${this.value})`
      }
      if (this.model) {
        base.backgroundColor = this.model['background-color']
        base.backgroundRepeat = this.model['background-repeat']
      }
      return base
    },
    hasImage () {
      return this.value && this.value !== 'none'
    }
  }
}
</script>
