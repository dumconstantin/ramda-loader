'use strict'

var expect = require('chai').expect;
var sample = require('./../sample/dist/bundle.js')

describe('loader tests', () => {

  it('should properly replace ramda functions', () => {

    console.log(sample, sample(10))

  })

})
