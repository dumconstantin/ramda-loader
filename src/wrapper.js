import R from 'ramda'

let fn = () => {}

const ramdaWrappers = {
  f1: R.prop('a'),
  f2: R.prop,
  f3: R.mergeWith,
  n1: R.curryN(2, fn).apply(null, [null]),
  n2: R.curryN(2, fn),
  n3: R.curryN(3, fn),
  n4: R.curryN(4, fn),
  n5: R.curryN(5, fn),
  n6: R.curryN(6, fn),
  n7: R.curryN(7, fn),
  n8: R.curryN(8, fn),
  n9: R.curryN(9, fn),
  n10: R.curryN(10, fn)
}

const ramdaWrappersList = Object.keys(ramdaWrappers).map(x => ramdaWrappers[x].toString())

const wrapper = (FileName, Row, Char, fnName, fn) => {
  return function __ramdaDebugWrapperClosure() {
    let args = Array.prototype.slice.call(arguments)

    try {
      let result = fn.apply(null, args)

      if (
        true === result instanceof Function
        && -1 !== ramdaWrappersList.indexOf(result.toString())
      ) {
        return wrapper(FileName, Row, Char, fnName, result)
      } else {
        return result
      }

    } catch(e) {
      let message = `${FileName}:${Row}:${Char}:${fnName}\n`
      console.error(`Error args: `, args)
      e.message = message + e.message
      e.FileName = FileName
      e.Row = Row
      e.Char = Char
      e.args = args
      throw e
    }
  }
}

const regex = /__ramdaDebugWrapper\('([\.\/\w\-]+)',\s(\d+),\s(\d+),\s'(\w+)',\s(\w+)\)/g

const id = '__ramdaDebugWrapper'
const closureId = '__ramdaDebugWrapperClosure'

export { regex, wrapper as fn, id, closureId }
