var acorn = require('acorn')
import { builders as b } from 'ast-types'
import escodegen from 'escodegen'
import R from 'ramda'
import { traverse, replace } from 'estraverse'
import loaderUtils from 'loader-utils'
import getVisitor from './getVisitor'
import shortenFileName from './shortenFileName'
import { id as wrapperId } from './wrapper'

module.exports = function(source, map) {
  let self = this
  let ast
  let tree

  // Setup context
  self.debug = loaderUtils.parseQuery(self.query).debug
  self.ramdaImportFns = []
  self.wrapperId = wrapperId
  self.ramdaFns = Object.keys(R).filter(x => x !== 'default')
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

  // Add global Ramda fns
  let header = 'var R = require("ramda")\n'
  header += R.join('\n', R.map(x => `var ${x} = R.${x}`, self.ramdaImportFns))
  source = header + '\n\n' + source

  // Add ramdaDebugWrapper
  if (self.debug === true) {
    source = `var ${wrapperId} = require('${__dirname}/../dist/wrapper.js') \n ${source}`
  }

  this.callback(null, source, map)
};
