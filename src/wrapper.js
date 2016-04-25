function wrapper(FileName, Row, Char, fnName, fn) {
  return function () {
    var args = arguments
    try {
      var result = fn.apply(null, args)

      if (true === result instanceof Function) {
        return wrapper(FileName, Row, Char, fnName, result)
      } else {
        return result
      }

    } catch(e) {
      let err = new Error(FileName + ':' + Row + ':' + Char + ':' + fnName + ' ' + e.message)
      err.FileName = FileName
      err.Row = Row
      err.Char = Char
      err.args = args
      throw err
    }
  }
}
