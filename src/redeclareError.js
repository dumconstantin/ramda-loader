const redeclareError = (ctx, rowLoc, charLoc, name) => {
  return new Error(`

  [ramda-loader]
  Error: "${name}" is redeclared in ${ctx.file}:${rowLoc}:${charLoc}
  RamdaJs functions shouldn't be redeclared if you want to use RamdaJs without the R. namespace.

            `)
}

export default redeclareError
