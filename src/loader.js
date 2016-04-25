var acorn = require('acorn'); // parser
var b = require('ast-types').builders; // ast types
var escodegen = require('escodegen'); // generator

var wrapperId = require('./wrapper.js').id

import ramda from 'ramda'

import { traverse, replace } from 'estraverse'

import loaderUtils from 'loader-utils'

import isIdentifier from './isIdentifier'
import isDeclaration from './isDeclaration'
import rowAt from './rowAt'
import charAt from './charAt'


const redeclareError = (ctx, rowLoc, charLoc, name) => {
  return new Error(`

  [ramda-global-loader]
  Error: "${name}" is redeclared in ${ctx.file}:${row}:${charLoc}
  RamdaJs functions shouldn't be redeclared if you want to use RamdaJs without the R. namespace.

            `)
}

const getVisitor = ctx => (node, parent) => {

  if (-1 !== ctx.ramdaFns.indexOf(node.name)) {
    let rowLoc = rowAt(ctx.source, node.start)
    let charLoc = charAt(ctx.source, node.start)

    if (isIdentifier(node, parent)) {

      if (-1 !== ctx.ramdaImportFns.indexOf(node.name)) {
        ctx.ramdaImportFns.push(node.name)
      }

      if (ctx.debug === true) {
        return b.callExpression(b.identifier(ctx.wrapperId), [
          b.literal(ctx.file),
          b.literal(rowLoc),
          b.literal(charLoc),
          b.literal(node.name),
          b.identifier(node.name)
        ])
      }
    } else if (isDeclaration(node, parent)) {
      ctx.emitError(redeclareError(ctx, rowLoc, charLoc, node.name))
    }
  }

  return node
}

const shortenFileName = file => {

  // Shorten the file name
  if (file.length > 30) {
    file = file.substr(file.length - 30)
    file = file.substr(file.indexOf('/'))
    file = '..' + file
  }

  return file
}

module.exports = function(source, map) {
  let self = this
  let ast
  let tree

  // Setup context
  self.debug = loaderUtils.parseQuery(self.query).debug
  self.ramdaImportFns = []
  self.wrapperId = wrapperId
  self.ramdaFns = Object.keys(ramda).filter(x => x !== 'default')
  self.file = shortenFileName(self.resourcePath)
  self.source = source
  self.cacheable()

  try {
    ast = acorn.parse(source, {
      sourceType: 'module'
    })
  } catch (e) {
    self.emitError(new Error('[ramda-debug-loader]', e))
    return source
  }

  let visitor = {
    leave: getVisitor(self)
  }

  if (self.debug === true) {
    tree = replace(ast, visitor)
    source = escodegen.generate(tree)
  } else {
    traverse(ast, visitor)
  }

  /*
  let header = 'var R = require("ramda")\n'
  header += R.join('\n', R.map(x => `var ${x} = R.${x}`, fns))
  source = header + '\n\n' + source
  */

  source = `var ${wrapperId} = require('${__dirname}/../dist/wrapper.js') \n ${source}`

  this.callback(null, source, map)
};
