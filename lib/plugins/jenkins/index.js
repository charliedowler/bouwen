var request = require('request');

function getLatestBuild(auth, callback) {
  var job = auth.job;
  var jobLen = job.length - 1;  
  if (job[jobLen] == '/') {
    job = job.substring(0, jobLen);    
  }

  request.post({
    url: job + '/api/json',
    auth: auth
  }, function (err, res) {
    if (err) callback(err);

    var reg = /Failed to login/;    
    if (reg.test(res.body)) {
      callback('Failed to login')
    }

    var builds = JSON.parse(res.body).builds;    
    var buildUrl = builds[0].url;

    callback(null, buildUrl + 'api/json', auth);
  });
}

function getLatestBuildStatus(err, url, auth) {
  err = (err) ? new Error(err) : (!url) ? new Error('Failed to get job url') : false;
  if (err) throw err;
  request.post({
    url: url,
    auth: auth
  }, function (err, res) {
    var build = JSON.parse(res.body);
    console.log(build.result);
  });
}

exports.status = function (auth) {  
  getLatestBuild(auth, getLatestBuildStatus);
}