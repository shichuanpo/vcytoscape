<template lang="pug">
.setting-form
  vue-form-generator(:schema="computedSchema", :model="model")
</template>
<script>
import { edgeSchema, nodeSchema } from '../config'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
export default {
  name: 'vcytoscapeSetting',
  components: { VueFormGenerator: VueFormGenerator.component },
  props: {
    type: {
      type: String,
      default: 'nodes'
    },
    schema: {
      type: Array
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
      nodeSchema: {
        fields: nodeSchema
      },
      edgeSchema: {
        fields: edgeSchema
      }
    }
  },
  computed: {
    computedSchema () {
      return this.schema
        ? { fields: this.schema }
        : (this.type === 'nodes' ? this.nodeSchema : this.edgeSchema)
    }
  }
}
</script>
<style lang="less" scoped>
.setting-form {
  /deep/ .vue-form-generator{
    fieldset{
      border: none;
      legend{
        border-bottom: 1px solid #ddd;
        width: 100%;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: 660;
      }
    }
    .errors.help-block {
      display: none;
    }
    .form-group{
      display: flex;
      padding: 0 1% 0 1%;
      & > label {
        width: 6em;
        margin-right: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
        height: 32px;
        line-height: 32px;
      }
      & > .field-wrap {
        flex: 1;
        vertical-align: middle;
      }
      input:not([type="range"]){
        -webkit-appearance: none;
        background-color: #FFFFFF;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #ddd;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #333;
        display: inline-block;
        font-size: inherit;
        height: 32px;
        line-height: 32px;
        outline: none;
        padding: 0 15px;
        -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
      }
      select{
        height: 32px;
        line-height: 32px;
      }
    }
    input:focus {
      outline: none;
      border-color: #01ACF3;
    }
    .field-input {
      input[type=range] {
        // -webkit-appearance: none;
        border-radius: 10px;
        outline: none;
        width: calc(~'100% - 52px');
        display: inline-block;
        vertical-align: middle;
        box-shadow: none;
        height: 100%;
        margin: 0;
        padding: 0;
      }
      input[type=range]:focus {
        outline: none;
      }
    }
    .image-box{
      width: 32px;
      height: 32px;
      background-repeat: none;
      background-size: 100% 100%;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      position: relative;
      .add{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #aaa;
        font-size: 20px;
        z-index: 0;
        cursor: pointer;
      }
      .remove{
        position: absolute;
        top: -5px;
        right: -5px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #f56c6c;
        color: #fff;
        line-height: 9px;
        text-align: center;
        z-index: 0;
        cursor: pointer;
      }
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
      input[type="file"]{
        border: none;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        cursor: pointer;
      }
    }
  }
}
</style>
