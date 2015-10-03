
module.exports = {
  
  dashToCamel: function(str) {
    return str.replace(/-([a-z])/gi, function(s, group1) {
        return group1.toUpperCase();
    });
  }
  
}