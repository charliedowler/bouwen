var request = require('request');

var TravisClient = function (root, branch) {
  this.root = root;
  this.branch = branch || 'master';
  return this;
};

TravisClient.isTravis = function (url) {
  return /travis/.test(url);
};

TravisClient.prototype.getBuildStatus = function (callback) {
  var self = this;
  request.get({
    url: self.root + '.json'
  }, function(err, res) {
    try {
      var json = JSON.parse(res.body);
      request.get({
        url: 'https://api.travis-ci.org/repos/'+ json.id +'/branches/' + self.branch
      }, function(err, resp) {
        var body = JSON.parse(resp.body);
        if (body.file == 'not found') {
          callback('UNKNOWN');
          return false;
        }
        var state = body.branch.state;
        callback(state.toUpperCase());
      });
    }
    catch(e) {
      callback('UNKNOWN');
    }
  });
  return this;
};

module.exports = TravisClient;