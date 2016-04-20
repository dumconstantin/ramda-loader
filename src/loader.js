
var acorn = require('acorn'); // parser
var esrecurse = require('esrecurse'); // walker
var t = require('ast-types').builders; // ast types
var escodegen = require('escodegen'); // generator

module.exports = function(source, map) {

  this.cacheable();

  source = query + source

  this.callback(null, source, map)
};
