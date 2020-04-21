  # vcytoscape
  > 本组件为基于cytoscape的关系图区块。
  > * 基于数据渲染当前显示的图，添加删除，只要修改数据即可；[<font color=#f16464>数据更新需要手动操作</font>](https://js.cytoscape.org/#eles.data)。
  > * filterByFunction会删除数据，但是会缓存，getAllElements能拿到包含过滤数据的全部数据
  > * 推荐使用[cytoscape-d3-force](https://github.com/shichuanpo/cytoscape.js-d3-force)布局，依赖d3-force, 有布局的进度返回

  ## Demo
  
  [demo](https://shichuanpo.github.io/vcytoscape/demo)

  ## Usage

  Download the library:

  `npm install vcytoscape`

  Import the library for your project:

  ```js
  import Vue from 'vue';
  import vcytoscape from 'vcytoscape';

  Vue.use( vcytoscape, {
      beforeCreate: (Cytoscape) => { // inject plugin for cytoscape
        Cytoscape.use(d3Force)
      }
  } );
  ```

  ## components

    分为两个组件 vcytoscape 和 vcytoscape-legend
    
  ## vcytoscape组件
  
  ### props
  
  参数 | 说明 | 类型 | 可选值 | 默认值
  :-: | :-: | :-: | :-: | :-:
  option | cytoscape原生配置，包括布局， 样式等等；[cytoscape文档](http://js.cytoscape.org/#introduction) | Object | - | {} | 
  data | cytoscape的图数据 | Array | - | [] |
  category | 分类配置，详见下表 | Object | - | {} |

  #### option

  ```javascript
  option = {
    layout: {
      name: 'cose',
      randomize: true,
      animate: false
    },
    style: [
      {
        selector: 'node',
        style: {
          'background-color': 'rgb(5, 161, 140)',
          'background-opacity': 0.6,
          'background-image-opacity': 0.6,
          'z-index-compare': 'manual',
          'z-index': 2
        }
      }
    ],
    minZoom: 0.5,
    maxZoom: 10
  }
  ```

  #### data

  ```javascript
  [{
    group: 'nodes',
    data: {
      id: 'XXX'
    }
  }, {
    group: 'nodes',
    data: {
      id: 'YYY'
    }
  }, {
    group: 'edges',
    data: {
      id: 'XXX-YYY',
      source: 'XXX',
      target: 'YYY'
  }]

  or

  {
    nodes: [{
      data: {
        id: 'XXX'
      }
    }, {
      data: {
        id: 'YYY'
      }
    }],
    edges: [{
      data: {
        id: 'XXX-YYY',
        source: 'XXX',
        target: 'YYY'
      }
    }]
  }
  ```

  ### category

  <table>
      <tr>
        <th></th>
      <th>类型</th>
        <th>参数</th>
        <th>说明</th>
      <th>类型</th>
      <th>可选值</th>
      <th>默认值</th>
    </tr>
    <tr>
        <td rowspan='6'>nodes</td>
        <td rowspan='4'>Array</td>
        <td>name</td>
      <td>指定分类项名称</td>
      <td>String</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
        <td>matching</td>
      <td>分类项匹配规则</td>
      <td>Function</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
        <td>style</td>
      <td>分类配色，具体参考cytoscape node颜色属性</td>
      <td>Object</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
        <td>formatter</td>
      <td>翻译</td>
      <td>Function</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
    <td rowspan='2'>Object</td>
        <td>key</td>
      <td>指定获取数据中的某个字段</td>
      <td>String</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>styles</td>
      <td>为上述style参数的数组或者key的键值对</td>
      <td>Object/Array</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
        <td rowspan='6'>edges</td>
        <td rowspan='4'>Array</td>
        <td>name</td>
      <td>指定分类项名称</td>
      <td>String</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
        <td>matching</td>
      <td>分类项匹配规则</td>
      <td>Function</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
        <td>style</td>
      <td>分类配色，具体参考cytoscape edge颜色属性</td>
      <td>Object</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
        <td>formatter</td>
      <td>翻译</td>
      <td>Function</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
    <td rowspan='2'>Object</td>
        <td>key</td>
      <td>指定获取数据中的某个字段</td>
      <td>String</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>styles</td>
      <td>为上述style参数的数组或者key的键值对</td>
      <td>Object/Array</td>
      <td>-</td>
      <td>-</td>
    </tr>
  </table>

```javascript
/**
 * 分类配置：两种写法
 * 写法一：
 * {
 *   key: 指定获取数据中的某个字段, (1.1.7新增 a.b.c 形式的对象字面量)
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
category = {
    nodes: [{
      name: 'category1',
      matching: data => data.label === 'category1', // 目前只支持函数
      style: {
        'background-color': '#c23531'
      },
      formatter: name => '分类1'
    }],
    edges: {
      key: 'category',
      styles: {
        category1: {
          'background-color': '#c23531'
        },
        category1: {
          'background-color': '#2f4554'
        }
      }
    }
  }
```

### methods

<table>
    <tr>
      <th>方法名</th>
      <th>参数</th>
      <th>说明</th>
      <th>返回</th>
    </tr>
    <tr>
      <td rowspan="3">filterByFunction</td>
      <td>Function (elements) { return elements }</td>
      <td>回调函数返回过滤后的元素集合</td>
      <td>filterid</td>
    </tr>
    <tr>
      <td>filterid</td>
      <td>用以重置已有的filterid</td>
      <td>-</td>
    </tr>
    <tr>
      <td>reLayout</td>
      <td>过滤集合后是否需要重新布局，默认false</td>
      <td>-</td>
    </tr>
    <tr>
      <td rowspan="2">resetFilter</td>
      <td>filterid</td>
      <td>重置filterid对应的过滤</td>
      <td>-</td>
    </tr>
    <tr>
      <td>reLayout</td>
      <td>过滤集合后是否需要重新布局，默认false</td>
      <td>-</td>
    </tr>
    <tr>
      <td>getAllElements</td>
      <td>-</td>
      <td>获取elements集合，当前显示的元素 + 过滤掉的元素集合</td>
      <td>elements</td>
    </tr>
</table>

### events

事件名 | 说明 | 参数
:-: | :-: | :-:
update | cytoscape实例数据更新（包括 数据重置，添加，删除，过滤等等） | cytoscape事件

其他详见cytoscape文档: http://js.cytoscape.org/#introduction

## vcytoscape-legend

### props

参数 | 说明 | 类型 | 可选值 | 默认值
:-: | :-: | :-: | :-: | :-:
value / v-model | 绑定值 | Object | - | -|
data | cytoscape渲染数据 | Array | - | [] |
option | 图例配置 | Object | - | {}| 
type | 图例类型 | String | nodes/edges | nodes| 
category | 图例分类配置 | Object | - | {}|

### category

同上

#### events

事件名 | 说明 | 参数
:-: | :-: | :-:
change | 图例变化 | legendMode