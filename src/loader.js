var acorn = require('acorn'); // parser
var b = require('ast-types').builders; // ast types
var escodegen = require('escodegen'); // generator
var ramda = require('ramda')
var ramdaFn = Object.keys(ramda)
var traverse = require('estraverse')

function wrapper(FileName, Row, Char, fnName, fn) {
  return function () {
    var args = arguments
    try {
      var result = fn.apply(null, args)

      if (true === result instanceof Function) {
        return wrapper(FileName, Row, Char, result)
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

function rowAt(text, charNo) {
  let sub = text.substr(0, charNo)
  let rows = sub.split('\n')
  return rows.length
}

function charAt(text, charNo) {
  let sub = text.substr(0, charNo)
  return charNo - sub.lastIndexOf('\n')
}

module.exports = function(source, map) {

  this.cacheable();

  var ast

  try {
    ast = acorn.parse(source, {
      sourceType: 'module'
    })
  } catch (e) {
    console.error('[ramda-debug-loader]', e)
    return source
  }

  let file = this.resourcePath
  var tree = traverse.replace(ast, {
    leave(node, parent) {
      if (-1 !== ramdaFn.indexOf(node.name)) {
        if (undefined === parent.object
          && 'FunctionDeclaration' !== parent.type
          && 'Identifier' === node.type
          && 'ArrowFunctionExpression' !== parent.type
          && 'Property' !== parent.type
//          && (undefined !== parent.init && 'Identifier' === parent.init.type)
        ) {
          return b.callExpression(b.identifier('wrapper'), [
            b.literal(file),
            b.literal(rowAt(source, node.start)),
            b.literal(charAt(source, node.start)),
            b.literal(node.name),
            b.identifier(node.name)
          ])
        }
      }
      return node
    }
  })

  source = escodegen.generate(tree)

  source = wrapper.toString() + '\n' + source

  this.callback(null, source, map)
};
