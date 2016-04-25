import rowAt from './rowAt'
import charAt from './charAt'
import isIdentifier from './isIdentifier'
import isDeclaration from './isDeclaration'
import redeclareError from './redeclareError'
import { builders as b } from 'ast-types'

const getVisitor = ctx => (node, parent) => {

  if (-1 !== ctx.ramdaFns.indexOf(node.name)) {
    let rowLoc = rowAt(ctx.source, node.start)
    let charLoc = charAt(ctx.source, node.start)

    if (isIdentifier(node, parent)) {

      if (-1 === ctx.ramdaImportFns.indexOf(node.name)) {
        ctx.ramdaImportFns.push(node.name)
      }

      if (ctx.debug === true && '__' !== node.name) {
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

export default getVisitor
