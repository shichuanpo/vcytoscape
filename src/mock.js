const group = ['hospital', 'clothes', 'computer', 'person', 'flower', 'tree', 'desk', 'house', 'water', 'cup']
const edgegroup = ['has', 'goto', 'love']
const year = ['2017', '2018', '2019']
// const MAX_Y = 800
// const MAX_X = 1500
function createId (salt, randomLength = 8) {
  return (
    (salt || '') +
    Number(
      Math.random()
        .toString()
        .substr(3, randomLength) + Date.now()
    ).toString(36)
  )
}
function createNodes (num) {
  let datas = []
  for (let i = 0; i < num; i++) {
    let _groupId = group[Math.floor(Math.random() * group.length)]
    let data = {
      id: createId('node_'),
      // positions: {
      //   x: Math.random() * MAX_X,
      //   y: Math.random() * MAX_Y,
      // },
      group: _groupId,
      parent: _groupId
    }
    data.label = data.group + '-node' + i
    datas.push({
      group: 'nodes',
      data,
      id: data.id
    })
  }
  return datas
}
// function createParent (nodes) {
//   let _parents = Array.from(new Set(nodes.map(node => node.data.group))).filter(p => !nodes.find(node => node.data.id === p) && p !== 'person')
//   return _parents.map(p => {
//     return {
//       group: 'nodes',
//       data: {
//         id: p,
//         label: p
//       },
//       id: p
//     }
//   })
// }
function createEdges (nodes, num) {
  let edges = []
  for (let i = 0; i < num - 1; i++) {
    let target = nodes[i + 1].data.id
    let source = nodes[Math.floor(Math.sqrt(i))].data.id
    let edge = {
      target,
      source,
      id: createId('edge_'),
      group: edgegroup[Math.floor(Math.random() * edgegroup.length)],
      time: year[Math.floor(Math.random() * year.length)] + '-' + Math.ceil(Math.random() * 12) + '-' + Math.ceil(Math.random() * 30)
    }
    edge.label = 'edge' + i
    edge.name = 'edge' + i

    edges.push({
      data: edge,
      group: 'edges',
      id: edge.id
    })
  }
  return edges
}
function createEdgesFromId (nodes, id) {
  let edges = nodes.map(node => {
    return {
      group: 'edges',
      data: {
        target: node.data.id,
        source: id,
        id: createId('edge_'),
        group: edgegroup[Math.floor(Math.random() * edgegroup.length)],
        label: node.data.id + '-' + id,
        name: node.data.id + '-' + id
      }
    }
  })
  return edges
}
function createData (num) {
  let nodes = createNodes(num)
  let edges = createEdges(nodes, num)
  return nodes.concat(edges)// .concat(createParent(nodes))
}
function createChildren (id, num) {
  let nodes = createNodes(num)
  let edges = createEdgesFromId(nodes, id)
  return nodes.concat(edges)
}
const fronts = [{
  name: '杨飞',
  id: 'yangfei',
  type: 'person',
  properties: {
    email: 'yangfei@sina.com',
    sex: 'female',
    age: 25,
    interest: ['draw', 'sing', 'eat'],
    marriage: 'none'
  }
}, {
  name: '张三',
  id: 'zhangsan',
  type: 'person',
  properties: {
    email: 'zhangsan@sina.com',
    sex: 'male',
    age: 26,
    interest: ['game', 'eat'],
    marriage: 'none'
  }
}, {
  name: '陆雪',
  id: 'luxue',
  type: 'person',
  properties: {
    email: 'luxue@sina.com',
    sex: 'female',
    age: 22,
    interest: ['sing', 'eat'],
    marriage: 'none'
  }
}, {
  name: '彤彤',
  id: 'tongtong',
  type: 'person',
  properties: {
    email: 'tongtong@sina.com',
    sex: 'female',
    age: 30,
    interest: ['eat'],
    marriage: 'married'
  }
}, {
  name: '李四',
  id: 'lisi',
  type: 'person',
  properties: {
    email: 'lisi@sina.com',
    sex: 'male',
    age: 30,
    interest: ['sing', 'eat', 'outdoors', 'game'],
    marriage: 'inlove'
  }
}, {
  name: '追风',
  id: 'zhuifeng',
  type: 'person',
  properties: {
    email: 'zhuifeng@sina.com',
    sex: 'male',
    age: 27,
    interest: ['versify', 'eat'],
    marriage: 'none'
  }
}, {
  name: '李飞',
  id: 'lifei',
  type: 'person',
  properties: {
    email: 'lifei@sina.com',
    sex: 'male',
    age: 26,
    interest: ['drive', 'eat', 'game'],
    marriage: 'none'
  }
}, {
  name: '王尼玛',
  id: 'wangnima',
  type: 'person',
  properties: {
    email: 'wangnima@sina.com',
    sex: 'male',
    age: 26,
    interest: ['outdoors', 'eat'],
    marriage: 'none'
  }
}, {
  name: '李国庆',
  id: 'liguoqing',
  type: 'person',
  properties: {
    email: 'liguoqing@sina.com',
    sex: 'male',
    age: 24,
    interest: ['outdoors', 'eat', 'dance'],
    marriage: 'none'
  }
}, {
  name: '叶风',
  id: 'yefeng',
  type: 'person',
  properties: {
    email: 'yefeng@sina.com',
    sex: 'male',
    age: 24,
    interest: ['outdoors', 'eat'],
    marriage: 'inlove'
  }
}, {
  name: '沈万三',
  id: 'shenwansan',
  type: 'person',
  properties: {
    email: 'shenwansan@sina.com',
    sex: 'male',
    age: 24,
    interest: ['code', 'eat'],
    marriage: 'inlove'
  }
}, {
  name: '裴一一',
  id: 'peiyiyi',
  type: 'person',
  properties: {
    email: 'peiyiyi@sina.com',
    sex: 'female',
    age: 23,
    interest: ['eat'],
    marriage: 'none'
  }
}, {
  name: '李元芳',
  id: 'liyuanfang',
  type: 'person',
  properties: {
    email: 'liyuanfang@sina.com',
    sex: 'male',
    age: 27,
    interest: ['eat', 'outdoors', 'sing'],
    marriage: 'none'
  }
}, {
  name: '蔡文姬',
  id: 'caiwenji',
  type: 'person',
  properties: {
    email: 'caiwenji@sina.com',
    sex: 'female',
    age: 31,
    interest: ['eat', 'drive'],
    marriage: 'married'
  }
}, {
  name: '苏烈',
  id: 'sulie',
  type: 'person',
  properties: {
    email: 'sulie@sina.com',
    sex: 'male',
    age: 26,
    interest: ['eat', 'outdoors', 'sing'],
    marriage: 'none'
  }
}, {
  name: '典韦',
  id: 'dianwei',
  type: 'person',
  properties: {
    email: 'dianwei@sina.com',
    sex: 'male',
    age: 27,
    interest: ['eat'],
    marriage: 'married'
  }
}, {
  name: '张飞',
  id: 'zhangfei',
  type: 'person',
  properties: {
    email: 'zhangfei@sina.com',
    sex: 'male',
    age: 24,
    interest: ['eat'],
    marriage: 'none'
  }
}, {
  name: '关羽',
  id: 'guanyu',
  type: 'person',
  properties: {
    email: 'guanyu@sina.com',
    sex: 'male',
    age: 24,
    interest: ['eat'],
    marriage: 'inlove'
  }
}, {
  name: '露娜',
  id: 'luna',
  type: 'person',
  properties: {
    email: 'luna@sina.com',
    sex: 'female',
    age: 27,
    interest: ['eat'],
    marriage: 'married'
  }
}, {
  name: '亚瑟',
  id: 'yangse',
  type: 'person',
  properties: {
    email: 'yase@sina.com',
    sex: 'male',
    age: 27,
    interest: ['eat', 'sing'],
    marriage: 'none'
  }
}, {
  name: '后羿',
  id: 'houyi',
  type: 'person',
  properties: {
    email: 'houyi@sina.com',
    sex: 'male',
    age: 27,
    interest: ['eat'],
    marriage: 'none'
  }
}, {
  name: '哪吒',
  id: 'nezha',
  type: 'person',
  properties: {
    email: 'nezha@sina.com',
    sex: 'male',
    age: 27,
    interest: ['eat'],
    marriage: 'none'
  }
}, {
  name: '黄忠',
  id: 'huangzhong',
  type: 'person',
  properties: {
    email: 'huangzhong@sina.com',
    sex: 'male',
    age: 27,
    interest: ['eat'],
    marriage: 'none'
  }
}, {
  name: '黎明',
  id: 'liming',
  type: 'person',
  properties: {
    email: 'liming@sina.com',
    sex: 'male',
    age: 27,
    interest: ['eat'],
    marriage: 'none'
  }
}]
const products = [{
  name: '打野',
  id: 'daye',
  startTime: '2019-2-01',
  version: 'v 1.0',
  type: 'product'
}, {
  name: '打架',
  id: 'dajia',
  startTime: '2018-12-01',
  version: 'v 0.8',
  type: 'product'
}, {
  name: '挂机',
  id: 'guaji',
  startTime: '2018-12-01',
  version: 'v 1.0',
  type: 'product'
}, {
  name: '团战',
  id: 'tuanzhan',
  startTime: '2019-12-12',
  version: 'v 1.0.0',
  type: 'product'
}, {
  name: '直播',
  id: 'zhibo',
  startTime: '2019-11-12',
  version: 'v 2.5.0',
  type: 'product'
}, {
  name: '买买买',
  id: 'maimaimai',
  startTime: '2019-11-27',
  version: 'v 1.3.1',
  type: 'product'
}, {
  name: '嘲讽',
  id: 'chaofeng',
  startTime: '2019-12-09',
  version: 'v 5.9.0',
  type: 'product'
}, {
  name: '病毒',
  id: 'bingdu',
  startTime: '2019-11-26',
  version: 'v 1.4.0',
  type: 'product'
}, {
  name: '团战',
  id: 'tuanzhan',
  startTime: '2019-12-12',
  version: 'v 1.0.0',
  type: 'product'
}, {
  name: '游泳',
  id: 'youyong',
  startTime: '2019-12-12',
  version: 'v 1.0.0',
  type: 'product'
}, {
  name: '跳伞',
  id: 'tiaosan',
  startTime: '2019-12-12',
  version: 'v 1.0.0',
  type: 'product'
}, {
  name: '滑雪',
  id: 'huaxue',
  startTime: '2019-11-01',
  version: 'v 1.0.0',
  type: 'product'
}]
const departments = [{
  name: '阵营1',
  id: 'zhenying1',
  address: 'xxx',
  type: 'department'
}, {
  name: '阵营2',
  id: 'zhen ying',
  address: 'xxx',
  type: 'department'
}, {
  name: '阵营3',
  id: 'zhenying3',
  address: '1号楼4楼',
  type: 'department'
}, {
  name: '阵营4',
  id: 'zhenying4',
  address: '1号楼3楼',
  type: 'department'
}, {
  name: '阵营5',
  id: 'zhenying5',
  address: '1号楼3楼',
  type: 'department'
}, {
  name: '阵营6',
  id: 'zhenying6',
  address: '4号楼4楼',
  type: 'department'
}, {
  name: '阵营7',
  id: 'zhenying7',
  address: '4号楼4楼',
  type: 'department'
}]
const relations = [{
  id: createId('relation'),
  source: 'yangfei',
  target: 'zhenying4',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'zhangsan',
  target: 'zhenying3',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'luxue',
  target: 'zhenying4',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'tongtong',
  target: 'zhenying5',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'tongtong',
  target: 'zhenying2',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'lisi',
  target: 'zhenying4',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'lisi',
  target: 'zhenying2',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'zhuifeng',
  target: 'zhenying3',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'lifei',
  target: 'zhenying3',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'wangnima',
  target: 'zhenying3',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'liguoqing',
  target: 'zhenying3',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'yefeng',
  target: 'zhenying5',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'peiyiyi',
  target: 'zhenying5',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'shenwansan',
  target: 'zhenying1',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'zhangfei',
  target: 'zhenying1',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'guanyu',
  target: 'zhenying1',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'luna',
  target: 'zhenying1',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'yangse',
  target: 'zhenying1',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'houyi',
  target: 'zhenying1',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'liyuanfang',
  target: 'zhenying5',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'caiwenji',
  target: 'zhenying5',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'sulie',
  target: 'zhenying5',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'dianwei',
  target: 'zhenying1',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'nezha',
  target: 'zhenying7',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'huangzhong',
  target: 'zhenying7',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'liming',
  target: 'zhenying6',
  type: 'belong'
}, {
  id: createId('relation'),
  source: 'dajia',
  target: 'yangfei',
  workload: 0.5,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'daye',
  target: 'yangfei',
  workload: 0.5,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'daye',
  target: 'luxue',
  workload: 0.5,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'guaji',
  target: 'lisi',
  workload: 0.3,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'guaji',
  target: 'lifei',
  workload: 0.4,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'guaji',
  target: 'yangfei',
  workload: 0.2,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'tuanzhan',
  target: 'zhuifeng',
  workload: 0.6,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'tuanzhan',
  target: 'liguoqing',
  workload: 0.5,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'tuanzhan',
  target: 'zhangsan',
  workload: 0.7,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'zhibo',
  target: 'lifei',
  workload: 0.3,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'zhibo',
  target: 'wangnima',
  workload: 0.2,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'maimaimai',
  target: 'lifei',
  workload: 0.3,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'chaofeng',
  target: 'lifei',
  workload: 0.3,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'bingdu',
  target: 'wangnima',
  workload: 0.8,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'tiaosan',
  target: 'tongtong',
  workload: 0.3,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'tiaosan',
  target: 'shenwansan',
  workload: 0.8,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'huaxue',
  target: 'liyuanfang',
  workload: 0.2,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'huaxue',
  target: 'yangfei',
  workload: 0.2,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'huaxue',
  target: 'sulie',
  workload: 0.2,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'huaxue',
  target: 'shenwansan',
  workload: 0.2,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'huaxue',
  target: 'nezha',
  workload: 0.2,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'youyong',
  target: 'liyuanfang',
  workload: 0.6,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'youyong',
  target: 'tongtong',
  workload: 0.3,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'youyong',
  target: 'peiyiyi',
  workload: 1,
  type: 'participate'
}, {
  id: createId('relation'),
  source: 'youyong',
  target: 'yefeng',
  workload: 1,
  type: 'participate'
}]
let nodes = fronts.concat(departments).concat(products).map(item => {
  return {
    group: 'nodes',
    data: item
  }
})
let edges = relations.map(relation => {
  return {
    group: 'edges',
    data: relation
  }
})
export default nodes.concat(edges)
export { createData, createChildren, createNodes, createEdges }
