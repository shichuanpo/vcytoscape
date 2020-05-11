<template lang="pug">
  .right-container
    header.header
      .title {{title}}
      a.close(@click="$emit('close')") ×
    section.body
      setting-form-generator(v-model="settingModel", :type="type")
</template>
<script>
import settingFormGenerator from './setting-form-generator'
export default {
  components: { settingFormGenerator },
  props: {
    model: {
      type: Object
    },
    type: {
      type: String,
      default: 'nodes'
    },
    title: {
      type: String
    }
  },
  model: {
    prop: 'model',
    event: 'change'
  },
  computed: {
    settingModel: {
      get () {
        return this.model
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  }
}
</script>
<style lang="less" scoped>
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
