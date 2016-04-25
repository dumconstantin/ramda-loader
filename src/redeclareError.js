const redeclareError = (ctx, rowLoc, charLoc, name) => {
  return new Error(`

  [ramda-global-loader]
  Error: "${name}" is redeclared in ${ctx.file}:${row}:${charLoc}
  RamdaJs functions shouldn't be redeclared if you want to use RamdaJs without the R. namespace.

            `)
}

export default redeclareError
