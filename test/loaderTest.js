'use strict'

var fs = require('fs')
var expect = require('chai').expect;
var webpack = require('webpack')
var config = require(`${__dirname}/../sample/webpack.config.js`)
var files = fs.readdirSync(`${__dirname}/../sample/src/`)
var validFiles = files.filter(x => /^valid/.test(x))
var invalidFiles = files.filter(x => /^invalid/.test(x))

var wrapperExp = /wrapper\('([\.\/\w\-]+)',\s(\d+),\s(\d+),\s'(\w+)',\s(\w+)\)/g

describe('loader tests', () => {
  var compiler

  validFiles.forEach(file => {

    it(`should compile and replace properly "${file}"`, (done) => {

      config.entry.sample = `${__dirname}/../sample/src/${file}`
      compiler = webpack(config)

      compiler.run(function (err, stat) {
        let source = fs.readFileSync(`${__dirname}/../sample/dist/bundle.js`, 'utf-8')
        let result = wrapperExp.exec(source)

        expect(err).to.be.null
        expect(result).to.not.be.null

        done()
      })

    })

  })

/*
  it('should run invalid sample tests', (done) => {

    config.entry.sample = __dirname + '/../sample/src/valid-1.js'
    compiler = webpack(config)

    compiler.run(function (err, stat) {
      console.log(stat)
      done()
    })

  })
  */
})
