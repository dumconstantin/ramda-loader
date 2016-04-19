module.exports = function(source, map) {
  this.cacheable();

  var query = this.query.substring(1) + "\n"

  source = query + source

  this.callback(null, source, map)
};
