'use strict'

var fs = require('fs')
var expect = require('chai').expect;
var webpack = require('webpack')
var config = require(`${__dirname}/../sample/webpack.config.js`)
var files = fs.readdirSync(`${__dirname}/../sample/src/`)
var validFiles = files.filter(x => /^valid/.test(x))
var invalidFiles = files.filter(x => /^invalid/.test(x))
var wrapper = require('./../dist/wrapper.js')
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
    wrapper.regex.lastIndex = 0
  })

  validFiles.forEach(file => {
    it(`should compile and replace properly "${file}"`, (done) => {
      compile(file, config, (errors, stat) => {
        let source = fs.readFileSync(`${__dirname}/../sample/dist/${file}`, 'utf-8')
        let result = wrapper.regex.exec(source)
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

  it('should throw an error', (done) => {
    compileFn('throwError.js',  fn => {
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

  it('should identify final function values as opposed to Ramda curry wrappers', done => {
    compileFn('curryWrappers.js', fns => {
      function foo() {}
      let a = { a: foo }

      function args(count, first) {
        let result = [first]
        while (count -= 1) {
          result.push('dummy')
        }
        return result
      }

      expect(fns.f('a').name).to.equal(wrapper.closureId)
      expect(fns.f('a', a).name).to.equal('foo')
      expect(fns.n2(foo, 1).name).to.equal('foo')

      // Test all possible variations of currying
      for (let i = 3; i <= 10; i += 1) {
        for (let j = i - 1; j >= 2; j -= 1) {
          expect(fns[`n${i}`].apply(null, args(j, foo)).name).to.equal(wrapper.closureId)
        }
        expect(fns[`n${i}`].apply(null, args(i, foo)).name).to.equal('foo')
      }

      done()
    })
  })

})
