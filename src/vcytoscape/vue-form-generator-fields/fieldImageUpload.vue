
<template lang="pug">
  .image-box(:style="imageBoxStyle")
    .add(v-if="!hasImage") +
    template(v-else)
      a.remove(@click="value='none'") -
    input(
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
  name: 'ImageUpload',
  mixins: [ abstractField ],
  methods: {
    imageChange (fileObj) {
      if (fileObj.target.files && fileObj.target.files[0]) {
        this.value = URL.createObjectURL(fileObj.target.files[0])
      }
    }
  },
  computed: {
    imageBoxStyle () {
      return {
        backgroundColor: this.model['background-color'],
        backgroundPosition: 'center',
        backgroundImage: `url(${this.value})`,
        backgroundRepeat: this.model['background-repeat'],
        backgroundSize: (!this.model['background-fit'] || this.model['background-fit'] === 'none')
          ? `${this.model['background-width']} ${this.model['background-height']}`
          : '100% 100%'
      }
    },
    hasImage () {
      return this.value && this.value !== 'none'
    }
  }
}
</script>
