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
  conf.output.filename = `${file}`
  conf.output.path = `${__dirname}/../sample/dist`
  webpack(conf).run((err, stat) => {
    cb(stat.compilation.errors, stat)
  })
}

const compileFn = (file, cb) => {
  let conf = clone(config)
  delete conf.entry.vendor
  delete conf.plugins
  delete conf.module.noParse
  compile(file, conf, () => {
    cb(require(`${__dirname}/../sample/dist/${file}`))
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
    compileFn('index.js', fn => {
      expect(fn(32)).to.be.a('string')
      expect(fn(10)).to.be.a('number')
      done()
    })
  })

  it('should trow an error on a redeclaration', (done) => {
    compileFn('redeclarationError.js',  fn => {
      let err
      try {
        fn(null)
      } catch (e) {
        err = e
      }

      expect(err).to.an('error')
      expect(err.args).to.not.be.empty
      expect(err.FileName).to.not.be.empty
      expect(err.Row).to.not.be.empty
      expect(err.Char).to.not.be.empty

      done()

    })
  })

})
