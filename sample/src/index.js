
function add(a) {
  return function (b) {
    throw new Error('a')
    return a + b
  }
}

module.exports = add(11)
