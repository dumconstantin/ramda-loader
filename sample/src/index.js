const add10 = add(10)

const answer = pipe(
  add10,
  ifElse(
    equals(42),
    always('The answer to your Ramda import problems'),
    subtract(__, 10)
  )
)

const parseCursors = v => {
  return {
    path: is(String, v) ? v : v[0],
    fn: is(String, v) ? identity : v[1] ? v[1] : identity,
    off: T
  }
}

module.exports = answer
