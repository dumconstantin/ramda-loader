var acorn = require('acorn'); // parser
var esrecurse = require('esrecurse'); // walker
var t = require('ast-types').builders; // ast types
var escodegen = require('escodegen'); // generator
var program = require("ast-query");
var ramda = require('ramda')
var ramdaFn = Object.keys(ramda)

module.exports = function(source, map) {

  this.cacheable();

  var ast = acorn.parse(source)

  var visitor = {
    CallExpression(node) {
      let name = node.callee.name

      if (-1 !== ramdaFn.indexOf(name)) {
        console.log(name, 'asdf')
      } else {

      }
    }
  }

  esrecurse.visit(ast, visitor)


  source = source + 'asdf';

  this.callback(null, source, map)
};
