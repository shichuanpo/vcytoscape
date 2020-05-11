import { merge } from '../common/util'
import edgeSchema from './edge-schema.json'
import nodeSchema from './node-schema.json'
/****
 * 支持的基础node样式(cytoscape不支持驼峰)
 */
const nodesBaseStyle = {
  'z-index': 2
}
/****
 * 支持的基础edge样式(cytoscape不支持驼峰)
 */
const edgesBaseStyle = {
  'z-index': 1
}
const baseColor = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
/**
 * 分类配置：两种写法
 * 写法一：
 * {
 *   key: 指定获取数据中的某个字段
 *   styles: 分类样式，可以为Array/Object键值对
 * }
 * 写法二：
 * [{
 *    name: '分类1',
 *    matching: data => data.label === '分类1', // 目前只支持函数
 *    style, // 具体参考cytoscape官网样式规范
 *    formatter: name => name // 格式转换，翻译
 * }]
 * **/
const categoryOption = {
  nodes: {
    key: 'category',
    styles: baseColor.map(color => merge({}, nodesBaseStyle, {
      'background-color': color,
      'border-color': color
    }))
  },
  edges: {
    key: 'category',
    styles: [JSON.parse(JSON.stringify(edgesBaseStyle))]
  }
}
/**
 * cytoscape配置： 完全参照cytoscape配置，详见cytoscape文档: http://js.cytoscape.org/#introduction
 * **/
const cytoscapeOption = {
  style: [
    {
      selector: ':active',
      style: {
        'overlay-opacity': 0
      }
    },
    {
      selector: 'node',
      style: JSON.parse(JSON.stringify(nodesBaseStyle))
    },
    {
      selector: 'edge',
      style: JSON.parse(JSON.stringify(edgesBaseStyle))
    },
    {
      selector: '.hover',
      style: {
        'background-opacity': 1,
        'background-image-opacity': 1,
        'z-index': 99
      }
    },
    {
      selector: 'edge.hover',
      style: {
        width: 2,
        'z-index': 98
      }
    },
    {
      selector: '.unhover',
      style: {
        'opacity': 0.3
        // 'z-index': 0
      }
    },
    {
      selector: 'edge.unhover',
      style: {
        width: 1,
        'opacity': 0.3
      }
    }
  ]
  // minZoom: 0.5,
  // maxZoom: 10
}
export default {
  categoryOption,
  cytoscapeOption,
  edgeSchema,
  nodeSchema
}
export {
  categoryOption,
  cytoscapeOption,
  edgeSchema,
  nodeSchema
}
