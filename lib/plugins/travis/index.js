var request = require('request');

var TravisClient = function (root) {
  this.root = root;
  return this;
};

TravisClient.isTravis = function (url) {
  return /travis/.test(url);
};

TravisClient.prototype.getBuildStatus = function (callback) {
  request.get({
    url: this.root + '.json'
  }, function(err, res) {
    try {
      var json = JSON.parse(res.body);
      callback((!json.last_build_status) ? 'PASSED' : 'FAILED');
    }
    catch(e) {
      callback('Unknown');
    }
  });
  return this;
};

module.exports = TravisClient;