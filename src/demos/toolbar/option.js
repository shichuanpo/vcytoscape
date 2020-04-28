export default {
  style: [{
    selector: 'node',
    style: {
      shape: 'round-rectangle'
    }
  }, {
    selector: 'node:parent',
    style: {
      'background-opacity': 0,
      'border-width': 0
    }
  }, {
    selector: 'edge',
    style: {
      width: 1,
      'curve-style': 'bezier',
      'target-arrow-shape': 'vee'
    }
  }, {
    selector: 'node[label]',
    style: {
      label: 'data(label)',
      'font-size': '9px',
      color: '#666',
      'z-index': 2
    }
  }, {
    selector: 'edge[label]',
    style: { 'font-size': '9px', color: '#626867', 'z-index': 1 }
  }],
  layout: {
    name: 'd3-force',
    animate: true,
    linkId: (d) => {
      return d.id
    },
    fit: false,
    fixedAfterDragging: true,
    alpha: 0.5,
    linkDistance: 100,
    linkStrength: 1,
    manyBodyStrength: -300,
    // xX: 500,
    // yY: 500,
    // ready: () => {},
    stop: (e) => {
      // this.layoutProgress = 1
      // setTimeout(() => {
      //   e.cy.fit()
      // }, 100)
    }, // on layoutstop
    tick: (progress) => {
      // this.layoutProgress = progress
    },
    randomize: false,
    infinite: true
  }
}
