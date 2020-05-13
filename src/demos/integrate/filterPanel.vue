<template lang="pug">
    .filter-box
      a.arrow(:class="{'arrow-top': !extend}", @click.stop="extend = !extend")
      div(v-show="extend")
        .filter-content
          label 饱和度：
          el-slider.slider(v-model="formdata.workload", range, :min="0", :max="1", :step="0.1", :marks="workloadMarks")
        .filter-content
          label 年龄：
          el-slider.slider(v-model="formdata.age", range, :min="20", :max="40", :marks="ageMarks")
        .filter-content
          label 性别：
          el-checkbox(v-model="formdata.sex", label="male") 男
          el-checkbox(v-model="formdata.sex", label="female") 女
        .filter-content
          label 婚恋情况：
          el-checkbox(v-model="formdata.marriage", label="married") 已婚
          el-checkbox(v-model="formdata.marriage", label="inlove") 恋爱中
          el-checkbox(v-model="formdata.marriage", label="none") 未婚
        .filter-content
          label 兴趣：
          el-checkbox(v-model="formdata.interest", label="sing") 唱歌
          el-checkbox(v-model="formdata.interest", label="draw") 画画
          el-checkbox(v-model="formdata.interest", label="eat") 吃货
          el-checkbox(v-model="formdata.interest", label="versify") 写诗
          el-checkbox(v-model="formdata.interest", label="outdoors") 户外运动
          el-checkbox(v-model="formdata.interest", label="code") 写代码
          el-checkbox(v-model="formdata.interest", label="dance") 跳舞
          el-checkbox(v-model="formdata.interest", label="game") 玩游戏
          el-checkbox(v-model="formdata.interest", label="drive") 飙车
</template>
<script>
export default {
  name: 'filterPanel',
  props: {
    model: {
      type: Object
    }
  },
  model: {
    prop: 'model',
    event: 'change'
  },
  computed: {
    formdata: {
      get () {
        return Object.assign(this.defaultFormData, JSON.parse(JSON.stringify(this.model)))
      }
    }
  },
  watch: {
    formdata: {
      handler (val) {
        this.$emit('change', val)
      },
      deep: true
    }
  },
  data () {
    return {
      extend: false,
      defaultFormData: {
        workload: [0, 1],
        marriage: ['married', 'inlove', 'none'],
        sex: ['female', 'male'],
        age: [20, 40],
        interest: ['eat', 'sing', 'draw', 'versify', 'code', 'outdoors', 'dance', 'drive', 'game']
      },
      workloadMarks: {
        0.5: {
          style: {
            color: '#e6a23c'
          },
          label: '滑水专家'
        },
        0.6: '不够饱和',
        0.8: '正常运转',
        1: {
          style: {
            'color': '#f56c6c',
            'white-space': 'nowrap'
          },
          label: '超负荷'
        }
      },
      ageMarks: {
        20: '20岁',
        25: '25岁',
        30: '30岁'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.filter-box{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  text-align: left;
  border: 1px solid #ddd;
}
.filter-content{
  margin: 10px 20px;
  label{
    width: 6rem;
    display: inline-block;
  }
}
.arrow {
  position: absolute;
  left: 50%;
  width: 30px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 10px solid #409eff;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    margin-left: -5px;
    top: -7px;
    border: 5px solid transparent;
    border-top-color: #fff;
  }
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    margin-left: -5px;
    width: 10px;
    border-top: 1px solid #fff;
    top: -9px;
  }
  &.arrow-top {
    margin-top: -10px;
    transform: rotate(180deg)translateY(0);
  }
}

.slider{
  display: inline-block;
  vertical-align: middle;
  width: 600px;
  margin-left: 10px;
}
</style>
