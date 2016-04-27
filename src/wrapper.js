
const wrapper = (FileName, Row, Char, fnName, fn) => {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    try {
      var result = fn.apply(null, args)

      if (true === result instanceof Function) {
        return wrapper(FileName, Row, Char, fnName, result)
      } else {
        return result
      }

    } catch(e) {
      let message = `${FileName}:${Row}:${Char}:${fnName}\n`
      message += `Args: ${args}\n`
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

export { regex, wrapper as fn, id }
