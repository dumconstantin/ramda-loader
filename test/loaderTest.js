'use strict'

var fs = require('fs')
var expect = require('chai').expect;
var webpack = require('webpack')
var config = require(`${__dirname}/../sample/webpack.config.js`)
var files = fs.readdirSync(`${__dirname}/../sample/src/`)
var validFiles = files.filter(x => /^valid/.test(x))
var invalidFiles = files.filter(x => /^invalid/.test(x))
var wrapperExp = require('./../dist/wrapper.js').regex

const compile = (file, config, cb) => {
  config.entry.sample = `${__dirname}/../sample/src/${file}`
  config.output.filename = `${__dirname}/../sample/dist/${file}`
  webpack(config).run((err, stat) => {
    cb(stat.compilation.errors, stat)
  })
}

describe('loader tests', () => {

  beforeEach(() => {
    wrapperExp.lastIndex = 0
  })

  validFiles.forEach(file => {
    it(`should compile and replace properly "${file}"`, (done) => {
      compile(file, config, (errors, stat) => {
        let source = fs.readFileSync(`${__dirname}/../sample/dist/${file}`, 'utf-8')
        let result = wrapperExp.exec(source)
        expect(errors.length).to.equal(0)
        expect(result).to.not.be.null
        done()
      })
    })
  })

  invalidFiles.forEach(file => {
    it(`shouldn't compile and replace "${file}"`, (done) => {
      compile(file, config, (errors, stat) => {
        expect(errors).to.have.length.above(0)
        done()
      })
    })
  })
})
