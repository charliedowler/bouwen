var request = require('request');

function makeRequest(auth) {  
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
    if (err) throw new (err);  
    try {
      var data = JSON.parse(res.body);      
      console.log(data.latestResult.state);
    }
    catch (e) {      
      console.log('- error grabbing status');
    }
  });
}

exports.status = function (auth) {
  makeRequest({
    job: auth.job,
    branch: auth.branch,
    user: auth.user,
    pass: auth.pass
  });
};