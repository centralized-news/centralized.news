/*!
 * read-glob-promise | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/read-glob-promise
*/

'use strict';

var ES6Promise = global.Promise || require('es6-promise').Promise;
var readYaml = require('read-yaml');

module.exports = function readYamlPromise(filePath, options) {
  var reject;
  var resolve;

  readYaml(filePath, options, function(err, data) {
    if (err) {
      reject(err);
      return;
    }
    resolve(data);
  });

  return new ES6Promise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
};
