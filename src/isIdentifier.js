
const isIdentifier = (node, parent) => {

  if (
    (node.type === 'Identifier') && (
      (parent.type === 'ExpressionStatement' 
        && parent.expression.name === node.name) ||
      (parent.type === 'Property' && parent.value.name === node.name) ||
      (parent.type === 'VariableDeclarator' && parent.init.name === node.name) ||
      (parent.type === 'CallExpression' &&
        undefined !== parent.arguments.find(x => x.name === node.name)) ||
      (parent.type === 'ReturnStatement' && parent.argument.name === node.name) ||
      (parent.type === 'ArrayExpression' &&
        undefined !== parent.elements.find(x => x.name === node.name)) ||
      (parent.type === 'MemberExpression' &&
       parent.object.name === node.name &&
       parent.object.start === node.start &&
       -1 !== ['apply', 'call'].indexOf(parent.property.name)) ||
      (parent.type === 'CallExpression' && parent.callee.name === node.name) ||
      (parent.type === 'ConditionalExpression') ||
      (parent.type === 'ExportDefaultDeclaration' &&
       parent.declaration.name === node.name) ||
      (parent.type === 'AssignmentExpression' &&
       parent.right.name === node.name)
    )
  ) {
    return true
  } else {
    return false
  }

}

export default isIdentifier
