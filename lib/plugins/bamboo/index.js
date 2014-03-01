var request = require('request');

function makeRequest(auth, callback) {
  request.get({
    url: auth.job + '/' + auth.branch + '.json',
    headers: {
      accept: 'application/json'
    },
    qs: {
      os_username: auth.user,
      os_password: auth.pass,
      os_authType: 'basic'
    }
  }, function (err, res) {
    if (err) {
      callback(err);
      return false;
    }
    try {
      var data = JSON.parse(res.body);
      callback(data.latestResult.state);
    }
    catch (e) {      
      callback('failed to grab status');
    }
  });
}

exports.status = function (auth, callback) {
  makeRequest({
    job: auth.job,
    branch: auth.branch,
    user: auth.user,
    pass: auth.pass
  }, callback);
};

exports.isBamboo = function(url, callback) {
  callback(/rest\/api/.test(url));
};