<template lang="pug">
  vue-form-generator(:schema="schema", :model="model")
</template>
<script>
import { edgeSchema, nodeSchema } from '../../config'
import '../../style/index.less'
export default {
  props: {
    type: {
      type: String,
      default: 'nodes'
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
    schema () {
      return this.type === 'nodes' ? this.nodeSchema : this.edgeSchema
    }
  }
}
</script>
