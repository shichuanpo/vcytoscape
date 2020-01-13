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
export default createData(20)
export { createData, createChildren, createNodes, createEdges }
