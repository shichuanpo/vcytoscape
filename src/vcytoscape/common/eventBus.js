
let bus = null
const createBus = V => {
  bus = new V()
  return bus
}
export {
  createBus,
  bus
}
