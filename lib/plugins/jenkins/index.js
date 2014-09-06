var request = require('request');

/**
 * Setup the jenkins client
 * @param {String} root
 * @returns {JenkinsClient}
 * @constructor
 */
var JenkinsClient = function(root) {
  this.root = root;
  return this;
};

/**
 * Check if url is in jenkins format
 * @param {String} url
 * @returns {*|boolean}
 */
JenkinsClient.isJenkins = function(url) {
  return /\/job\//.test(url);
};

/**
 *
 * @param {String} username
 * @param {String} password
 * @param {Function} callback
 * @returns {JenkinsClient}
 */
JenkinsClient.prototype.login = function(username, password, callback) {
  this.auth = {
    user: username,
    pass: password
  };
  var payload = {
    uri: this.root + '/api/json',
    auth: this.auth
  };

  request.post(payload, function(err, res) {
    if (err) {
      callback(err);
      return false;
    }

    if (res.statusCode >= 400) {
      callback('Failed to login: ' + res.statusCode);
      return false;
    }

    this.builds = JSON.parse(res.body).builds;

    callback(null, this);
  }.bind(this));
  return this;
};

/**
 * Get latest build from response
 * @param {Function} callback
 * @returns {JenkinsClient}
 */
JenkinsClient.prototype.getBuildStatus = function(callback) {
  var payload = {
    uri: this.builds[0].url + '/api/json',
    auth: this.auth
  };

  request.post(payload, function (err, res) {
    if (err) {
      callback(err);
      return false;
    }
    var build = JSON.parse(res.body);
    callback((build.building) ?  'BUILDING' : build.result);
  });

  return this;
};

module.exports = JenkinsClient;