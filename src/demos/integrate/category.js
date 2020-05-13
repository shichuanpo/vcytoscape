
import person from '../../assets/unvip.svg'
import product from '../../assets/product.svg'
import department from '../../assets/department.svg'
export default {
  nodes: {
    key: 'type',
    styles: {
      product: {
        'shape': 'barrel',
        'background-image': product,
        'background-width': '80%',
        'background-height': '80%',
        'background-repeat': 'no-repeat',
        'background-color': 'rgba(237, 99, 161, 1)',
        'border-color': 'rgba(235, 138, 224, 1)'
      },
      department: {
        'shape': 'cut-rectangle',
        'background-image': department,
        'background-width': '80%',
        'background-height': '80%',
        'background-repeat': 'no-repeat',
        'background-color': 'rgba(241, 125, 17, 1)',
        'border-color': 'rgba(241, 125, 17, 1)'
      },
      person: {
        'shape': 'ellipse',
        'background-image': person,
        'background-fit': 'contain',
        'background-repeat': 'no-repeat',
        'background-color': 'rgba(179, 222, 6, 1)',
        'border-color': 'rgba(179, 222, 6, 1)'
      }
    }
  },
  edges: [{
    name: '参与活动',
    matching: _data => _data.type === 'participate',
    style: {
      'curve-style': 'bezier',
      'line-style': 'solid',
      'line-color': 'rgba(232, 192, 15, 1)',
      'source-distance-from-node': 2,
      'target-distance-from-node': 2,
      'width': 1
    }
  }, {
    name: '阵营归属',
    matching: _data => _data.type === 'belong',
    style: {
      'curve-style': 'bezier',
      'target-arrow-fill': 'hollow',
      'target-arrow-shape': 'vee',
      'target-arrow-color': 'rgba(3, 177, 230, 1)',
      'line-style': 'dashed',
      'line-color': 'rgba(3, 177, 230, 1)',
      'source-distance-from-node': 2,
      'target-distance-from-node': 2,
      'width': 1
    }
  }]
}
