'use strict'

var fs = require('fs')
var expect = require('chai').expect;
var webpack = require('webpack')
var config = require(`${__dirname}/../sample/webpack.config.js`)
var files = fs.readdirSync(`${__dirname}/../sample/src/`)
var validFiles = files.filter(x => /^valid/.test(x))
var invalidFiles = files.filter(x => /^invalid/.test(x))
var wrapperExp = require('./../dist/wrapper.js').regex
var clone = require('ramda').clone

const compile = (file, config, cb) => {
  let conf = clone(config)
  conf.entry.sample = `${__dirname}/../sample/src/${file}`
  conf.output.filename = `${__dirname}/../sample/dist/${file}`
  webpack(conf).run((err, stat) => {
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

  it('should load properly the encountered Ramda functions', (done) => {
    let conf = clone(config)
    delete conf.entry.vendor
    delete conf.plugins
    delete conf.module.noParse
    compile('index.js', conf, (errors, stat) => {
      let fn = require(`${__dirname}/../sample/dist/index.js`)
      expect(fn(32)).to.be.a('string')
      expect(fn(10)).to.be.a('number')
      done()
    })
  })

})
