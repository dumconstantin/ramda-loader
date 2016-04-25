
const shouldReplace = (node, parent) => {

  if (node.type !== 'Identifier') {
    return false
  }

  if (
    (parent.type === 'ExpressionStatement' && parent.expression.name === node.name) ||
    (parent.type === 'Property' && parent.value.name === node.name) ||
    (parent.type === 'VariableDeclarator' && parent.init.name === node.name)
  ) {
    return true
  }

}

export default shouldReplace
