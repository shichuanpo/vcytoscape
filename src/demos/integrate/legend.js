export default {
  nodes: {
    show: true,
    formatter: str => {
      let translate = {
        product: '活动',
        department: '阵营',
        person: '人员'
      }
      Object.keys(translate).forEach(key => {
        str = str.replace(key, translate[key])
      })
      return str
    },
    orient: 'vertical',
    style: {
      padding: '10px',
      top: 0,
      left: 0
    },
    tagStyle: {
      borderWidth: '1px',
      borderStyle: 'solid'
    },
    inactiveTagStyle: {
      borderColor: '#ccc'
    }
  },
  edges: {
    show: true,
    style: {
      padding: '10px',
      top: 0,
      right: 0,
      left: 'auto'
    },
    tagStyle: {
      'borderRadius': 0,
      'borderWidth': 0,
      'borderTopWidth': '2px',
      'height': '0px',
      'line-height': '10px'
    },
    inactiveTagStyle: {
      borderColor: '#ccc',
      backgroundColor: 'none'
    }
  }
}
