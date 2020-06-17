export default {
  style: [{
    selector: 'node:parent',
    style: {
      'background-opacity': 0,
      'border-width': 0
    }
  }, {
    selector: 'node',
    style: {
      'label': 'data(name)',
      'font-size': '10px',
      'color': '#666',
      'z-index': 1000
    }
  }],
  layout: {
    name: 'd3-force',
    fit: false,
    animate: true,
    linkId: (d) => d.id,
    fixedAfterDragging: true,
    alpha: 0.5,
    linkDistance: 100,
    linkStrength: 1,
    manyBodyStrength: -300,
    stop: (e) => {},
    tick: (progress) => {},
    randomize: true,
    infinite: true
  }
}
