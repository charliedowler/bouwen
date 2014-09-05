var request = require('request');

/**
 * Setup the client
 * @param {String} root
 * @param {String} branch
 * @returns {BambooClient}
 * @constructor
 */
var BambooClient = function(root, branch) {
  this.root = root + '/' + branch + '.json';
  return this;
}

/**
 * Check if url is in bamboo format
 * @param {String} url
 * @returns {*|boolean}
 */
BambooClient.isBamboo = function(url) {
  return /rest\/api/.test(url)
};

/**
 * Login to bamboo
 * @param {String} username
 * @param {String} password
 * @param {Function} callback
 * @returns {BambooClient}
 */
BambooClient.prototype.login = function(username, password, callback) {
  request.get({
    url: this.root,
    headers: {
      accept: 'application/json'
    },
    qs: {
      os_username: username,
      os_password: password,
      os_authType: 'basic'
    }
  }, function (err, res) {
    if (err) {
      callback(err);
      return false;
    }

    if (res.statusCode >= 400) {
      callback('Failed to login: ' + res.statusCode + ' => ' + res.headers['x-seraph-loginreason']);
      return false;
    }

    this.data = JSON.parse(res.body);

    callback(null, this);
  }.bind(this));

  return this;
};

/**
 * Get build status from json response
 * @param {Function} callback
 * @returns {BambooClient}
 */
BambooClient.prototype.getBuildStatus = function(callback) {
  if ('latestResult' in this.data) {
    callback(this.data.latestResult.state || 'Unknown');
  }
  else {
    callback('Unknown');
  }
  return this;
};

module.exports = BambooClient;