var acorn = require('acorn'); // parser
var esrecurse = require('esrecurse'); // walker
var b = require('ast-types').builders; // ast types
var escodegen = require('escodegen'); // generator
var program = require("ast-query");
var ramda = require('ramda')
var ramdaFn = Object.keys(ramda)
var traverse = require('estraverse')

function wrapper(FileName, Row, Char, fn) {
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
      let err = new Error(FileName + ':' + Row + ':' + Char + ' ' + e.message)
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

  let file = this.resourcePath

  var ast = acorn.parse(source)

  var tree = traverse.replace(ast, {
    leave(node, parent) {
      if (-1 !== ramdaFn.indexOf(node.name)) {
        if (undefined === parent.object && 'FunctionDeclaration' !== parent.type) {
          return b.callExpression(b.identifier('wrapper'), [
            b.literal(file),
            b.literal(rowAt(source, node.start)),
            b.literal(charAt(source, node.start)),
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
