exports.HTMLSPACIALCHAR = function(str) {
  return str.replace(/[&<>'"]/g,
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
      }[tag]));
}

exports.isSet = function(args) {
  if (!args || args == '' || args.trim() == '' || args == 'undefined')
      return false;
  return true;
}