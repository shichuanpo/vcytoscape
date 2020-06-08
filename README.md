- [vcytoscape](#vcytoscape)
  * [案例](#案例)
  * [快速上手](#快速上手)
  * [包含组件](#包含组件)
  * [vcytoscape组件](#vcytoscape组件)
    + [属性](#属性)
    + [方法](#方法)
    + [事件](#事件)
    + [插槽](#插槽)
  * [vcytoscape-legend](#vcytoscape-legend)
    + [属性](#-属性-)
    + [事件](#-事件-)
  * [vcytoscape-setting](#vcytoscape-setting)
    + [属性](#属性-)
  * [附录说明](#附录说明)
    + [category](#category)
    + [option](#option)
    + [data](#data)
    + [toolbar](#toolbar)

# vcytoscape

  > 本组件为基于cytoscape的关系图区块。
  > * 基于数据渲染当前显示的图，添加删除，只要修改数据即可。
  > * filterByFunction会删除数据，但是会缓存，getAllElements能拿到包含过滤数据的全部数据
  > * 数据量超过1k，推荐使用[cytoscape-d3-force](https://github.com/shichuanpo/cytoscape.js-d3-force)布局，依赖d3-force, 有布局的进度返回

## 案例
  
  [基础用法](https://shichuanpo.github.io/vcytoscape/demo/index.html)
  [分类颜色](https://shichuanpo.github.io/vcytoscape/demo/category.html)
  [图例用法](https://shichuanpo.github.io/vcytoscape/demo/legend.html)
  [工具栏](https://shichuanpo.github.io/vcytoscape/demo/toolbar.html)
  [分类编辑](https://shichuanpo.github.io/vcytoscape/demo/editable.html)
  [综合案例](https://shichuanpo.github.io/vcytoscape/demo/integrate.html)
  
## 快速上手

  安装依赖包:

  `npm install vcytoscape`

  添加插件:
  
  1.1.8及之前版本Vue.use第二个参数option不能为空❗️
  ```js
  import Vue from 'vue';
  import vcytoscape from 'vcytoscape';
  import d3Force from 'cytoscape-d3-force'
  Vue.use(vcytoscape, {
      beforeCreate: (Cytoscape) => { // inject plugin for cytoscape
        Cytoscape.use(d3Force)
      }
  });
  ```
  
  获取配置的schema ✅
  ```js
  import { nodeSchema, edgeSchema } from 'vcytoscape'
  ```

## 包含组件

    该组件分为三个组件 vcytoscape 、 vcytoscape-legend 、 vcytoscape-setting
    
## vcytoscape组件
  
### 属性
  
  参数 | 说明 | 类型 | 可选值 | 默认值
  :-: | :-: | :-: | :-: | :-:
  [option](#option) | cytoscape原生配置，包括布局， 样式等等；[cytoscape文档](http://js.cytoscape.org/#introduction) | Object | - | {} | 
  [data](#data) | cytoscape的图数据 | Array | - | [] |
  [category](#category) | 分类配置，详见下表 | Object | - | {} |
  [toolbar](#toolbar) | 工具栏 | Object | - | {} |
  behavior | 默认行为（点击高亮相邻节点）| Boolean | true/false | true |
  
### 方法

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

### 事件

事件名 | 说明 | 参数
:-: | :-: | :-:
update | cytoscape实例数据更新（包括 数据重置，添加，删除，过滤等等） | cytoscape事件

其他详见cytoscape文档: http://js.cytoscape.org/#introduction

### 插槽

name | 说明
:-: | :-:
legend | scope参数带有 data 和 category
toolbar-before | 工具栏（前面）
toolbar-after| 工具栏 （后面）

## vcytoscape-legend

### -属性-

参数 | 说明 | 类型 | 可选值 | 默认值
:-: | :-: | :-: | :-: | :-:
value / v-model | 绑定值 | Object | - | -|
[data](#data) | cytoscape渲染数据 | Array | - | [] |
[option](https://github.com/shichuanpo/vue-legend) | vue-legend图例配置 | Object | - | {}| 
type | 图例类型 | String | nodes/edges | nodes| 
[category](#category) | 图例分类配置 | Object | - | {} |


### -事件-

事件名 | 说明 | 参数
:-: | :-: | :-:
change | 图例变化 | legendMode
setting | 分类编辑点击事件 | params: { type, name, label }

## vcytoscape-setting

### 属性-

参数 | 说明 | 类型 | 可选值 | 默认值
:-: | :-: | :-: | :-: | :-:
value / v-model | 配置表单 | Object | - | -|
schema ✅ | 表单shcema | Array | - | - |


## 附录说明

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

### option

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

### data

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
#### toolbar
参数 | 说明 | 类型 | 可选值 | 默认值
:-: | :-: | :-: | :-: | :-:
style | 样式 | Object | vue的内联样式 | - |
content | 工具栏显示内容 | Boolean/Array | true: 显示全部默认；false: 不显示默认；可选值：[center,zoomin,zoomout,download,fullscreen] | false |
orient | 工具栏的方向 | String | horizontal/vertical | horizontal | 