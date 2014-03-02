var request = require('request');

function getLatestBuild(auth, callback) {
  var job = auth.job;
  var jobLen = job.length - 1;
  if (job[jobLen] == '/') {
    job = job.substring(0, jobLen);
  }

  var payload = {
    url: job + '/api/json'
  };

  if (auth.user && auth.pass) {
    payload.auth = auth;
  }

  request.post(payload, function (err, res) {
    if (err) {
      callback(err);
      return false;
    }

    var reg = /Failed to login/;
    if (reg.test(res.body)) {
      callback('Failed to login');
      return false;
    }

    var builds = JSON.parse(res.body).builds;
    var buildUrl = builds[0].url;

    payload.url = buildUrl + 'api/json';

    getLatestBuildStatus(null, payload, callback);
  });
}

function getLatestBuildStatus(err, payload, callback) {
  err = (err) ? err : (!payload.url) ? 'Failed to get job url' : false;
  if (err) {
    callback(err);
    return false;
  }
  request.post(payload, function (err, res) {
    if (err) {
      callback(err);
      return false;
    }
    var build = JSON.parse(res.body);
    callback((build.building) ?  'BUILDING' : build.result);
  });
}

exports.status = function (auth, callback) {
  getLatestBuild(auth, callback);
}

exports.isJenkins = function(url, callback) {
  callback(/\/job\//.test(url));
};