const handlers = {
  _cxttap: function (e) {
    let element = e.target
    this.elements().unselect()
    if (element !== this) {
      this.elements(element).select()
    }
  },
  _select: function (e) {
    let element = e.target
    if (element !== this) {
      let targetElement = this.elements(':selected')
      let hoverElements = this.collection()
      if (element.isNode()) {
        hoverElements = targetElement.closedNeighborhood()
      } else {
        hoverElements = hoverElements.merge(targetElement).merge(targetElement.connectedNodes())
      }
      let elseElements = this.elements().difference(hoverElements)
      elseElements.removeClass('hover').addClass('unhover')
      hoverElements.removeClass('unhover').addClass('hover')
    }
  },
  _unselect: function () {
    this.elements().removeClass('unhover').removeClass('hover')
  }
}
function createEvents (cy) {
  let selector = ''
  let events = []
  ;['select', 'unselect', 'cxttap'].forEach(item => {
    selector
      ? cy.on(item, selector, handlers[`_${item}`])
      : cy.on(item, handlers[`_${item}`])
    events.push(
      () => {
        selector
          ? cy.off(item, selector, handlers[`_${item}`])
          : cy.off(item, handlers[`_${item}`])
      })
  })
  return events
}
export default createEvents
