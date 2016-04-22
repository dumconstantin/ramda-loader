'use strict'

var expect = require('chai').expect;
var foo = require('./../sample/dist/bundle.js').foo

describe('loader tests', () => {

  it('should properly replace ramda functions', () => {
    let err

    try {
      foo(10, [1])
    } catch (e) {
      err = e
    }

    expect(err.FileName).to.exist
    expect(err.Row).to.exist
    expect(err.Char).to.exist
    expect(err.args).to.exist

  })

})
