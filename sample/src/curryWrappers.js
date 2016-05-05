
const fn = a => a

const wrappers = {
  f: prop,
  n2: curryN(2, fn),
  n3: curryN(3, fn),
  n4: curryN(4, fn),
  n5: curryN(5, fn),
  n6: curryN(6, fn),
  n7: curryN(7, fn),
  n8: curryN(8, fn),
  n9: curryN(9, fn),
  n10: curryN(10, fn)
}

module.exports = wrappers
