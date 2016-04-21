'use strict'

var expect = require('chai').expect;
var sample = require('./../sample/dist/bundle.js')

describe('loader tests', () => {

  it('should properly replace ramda functions', () => {

    expect(() => {
      sample(10, [1])
    }).to.throw('/home/markets/repos/ramda-debug-loader/sample/src/index.js:3:10 fn.apply is not a function')

  })

})
