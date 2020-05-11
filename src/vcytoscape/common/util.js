const isObject = function (item) {
  return Object.prototype.toString.call(item) === '[object Object]'
}
const isArray = function (item) {
  return Object.prototype.toString.call(item) === '[object Array]'
}
const isFunction = function (item) {
  return Object.prototype.toString.call(item) === '[object Function]'
}
const isUndefined = function (item) {
  return item === undefined
}
const __merge = function (type = 'merge', target, source) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        target[key] = isObject(target[key]) ? target[key] : {}
        target[key] = __merge(type, target[key], source[key])
      } else if (isArray(source[key])) {
        target[key] = isArray(target[key]) ? target[key] : []
        target[key] = __merge(type, target[key], source[key])
      } else if (!isUndefined(source[key])) {
        target[key] = source[key]
      }
    }
  } else if (isArray(target) && isArray(source)) {
    if (type === 'merge') {
      source.forEach((s, idx) => { // 数组根据idx合并
        if (isObject(s)) {
          target[idx] = isObject(target[idx]) ? target[idx] : {}
          target[idx] = __merge(type, target[idx], s)
        } else if (isArray(s)) {
          target[idx] = isArray(target[idx]) ? target[idx] : []
          target[idx] = __merge(type, target[idx], s)
        } else if (!isUndefined(s)) {
          target[idx] = source[idx]
        }
      })
    } else if (type === 'concat') {
      target = target.concat(source) // 数组合并
    } else if (type === 'findSelector') {
      source.forEach(item => {
        let itemInTarget = target.find(t => t.selector === item.selector)
        if (itemInTarget) {
          itemInTarget = __merge(type, itemInTarget, item)
        } else {
          target.push(item)
        }
      })
    } else {
      target = source
    }
  }
  return target
}
const _merge = function () {
  const objs = Array.from(arguments)
  if (objs.length < 2) {
    return
    // console.error('target or source cannot be null')
  }
  objs[1] = __merge(...objs)
  objs.splice(2, 1)
  if (objs.length > 2) {
    return _merge(...objs)
  } else if (objs.length === 2) {
    return objs[1]
  } else {
    return null
    // console.error('target or source cannot be null')
  }
}
const merge = function () {
  const objs = Array.from(arguments)
  return _merge('merge', ...objs)
}
const mergeArrayFindSelector = function () {
  const objs = Array.from(arguments)
  return _merge('findSelector', ...objs)
}
const mergeArrayConcat = function () {
  const objs = Array.from(arguments)
  return _merge('concat', ...objs)
}
const mergeArrayReplace = function () {
  const objs = Array.from(arguments)
  return _merge('replace', ...objs)
}
const createId = function (salt, randomLength = 8) {
  return (
    (salt || '') +
    Number(
      Math.random()
        .toString()
        .substr(3, randomLength) + Date.now()
    ).toString(36)
  )
}

/**
 * 十六进制颜色值的正则表达式
 * **/

const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/

/**
 * 颜色转为RGB格式, 只支持HEX/RGB/RGBA
 * **/

function colorRgba (color = '', alpha = 1) {
  let sColor = (color || '').toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    // 处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    sColorChange.push(alpha)
    return 'rgba(' + sColorChange.join(',') + ')'
  } else if (/^(rgb|RGB)/.test(color)) {
    const aColor = color.replace(/(?:\(|\)|rgba|RGBA|rgb|RGB)*/g, '').split(',')
    const [r, g, b] = aColor
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } else {
    return color
  }
}
function debounce (fn, delay, ctx) {
  let timer = null
  return function () {
    const context = ctx || this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
function filterParams (obj) {
  let _newPar = {}
  for (let key in obj) {
    if (
      (obj[key] === 0 || obj[key]) &&
      obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== ''
    ) {
      _newPar[key] = obj[key]
    }
  }
  return _newPar
}
export {
  isObject,
  isArray,
  isFunction,
  isUndefined,
  merge,
  mergeArrayFindSelector,
  mergeArrayConcat,
  mergeArrayReplace,
  createId,
  colorRgba,
  debounce,
  filterParams
}
