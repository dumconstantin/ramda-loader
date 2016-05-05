
const isDeclaration = (node, parent) => {

  if (
    (node.type === 'Identifier') && (
      (parent.type === 'VariableDeclarator' && parent.id.name === node.name) ||
      (parent.type === 'SequenceExpression' && 
        undefined !== parent.expressions.find(x => x.name === node.name)) ||
      (parent.type === 'FunctionDeclaration' && parent.id.name === node.name) ||
      (parent.type === 'FunctionDeclaration' &&
        undefined !== parent.params.find(x => x.name === node.name)) ||
      (parent.type === 'MemberExpression' &&
        parent.object.name === node.name &&
        parent.object.start === node.start &&
        -1 === ['apply', 'call'].indexOf(parent.property.name)) ||
      (parent.type === 'ImportSpecifier' && parent.local.name === node.name) ||
      (parent.type === 'ImportDefaultSpecifier' && parent.local.name === node.name) ||
      (parent.type === 'ImportNamespaceSpecifier' && parent.local.name === node.name) |
      (parent.type === 'ExportSpecifier' && parent.exported.name === node.name) ||
      (parent.type === 'ExportSpecifier' && parent.local.name === node.name)
    )
  ) {
    return true
  } else {
    return false
  }
}

export default isDeclaration
