import hospital from '../../assets/hospital.svg'
import person from '../../assets/person.svg'
import computer from '../../assets/computer.svg'
import clothes from '../../assets/clothes.svg'
export default {
  nodes: {
    key: 'group',
    styles: {
      hospital: {
        'background-image': hospital,
        'background-fit': 'cover',
        'background-repeat': 'no-repeat'
      },
      clothes: {
        'background-image': clothes,
        'background-fit': 'cover',
        'background-repeat': 'no-repeat'
      },
      computer: {
        'background-image': computer,
        'background-fit': 'cover',
        'background-repeat': 'no-repeat'
      },
      person: {
        'background-image': person,
        'background-fit': 'cover',
        'background-repeat': 'no-repeat'
      }
    }
  },
  edges: [{
    name: 'love',
    matching: data => data.group === 'love',
    style: {
      'source-arrow-shape': 'vee',
      'line-style': 'dashed',
      'line-color': '#61a0a8',
      'width': 1
    }
  }, {
    name: 'goto',
    matching: data => data.group === 'goto',
    style: {
      'line-style': 'dashed',
      'line-color': '#2f4554',
      'width': 1
    }
  }, {
    name: 'has',
    matching: data => data.group === 'has',
    style: {
      'line-style': 'dashed',
      'line-color': '#c23531',
      'width': 1
    }
  }]
}
