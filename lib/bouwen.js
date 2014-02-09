var jenkins = require('./plugins/jenkins/index'),
  bamboo = require('./plugins/bamboo/index')
  , fs = require('fs');

function getArgs(args) {
  return {
    platform: args[2],
    user: args[3],
    pass: args[4],
    branch: args[5]
  };
}
function readPackage(callback) {
  fs.readFile(process.cwd() + '/package.json', {
    encoding: 'utf8'
  }, function (err, data) {
    if (err) throw new Error(err);
    var package = JSON.parse(data);
    if (package.repository) {
      if (package.repository.job) {
        var job = package.repository.job;
        var jobLen = job.length - 1;  
        if (job[jobLen] == '/') {
          job = job.substring(0, jobLen);    
        }
        package.repository.job = job;
        callback(null, package);
      }
      else {
        callback('Missing job property');
      }
    }
    else {
      callback('Missing repository property');
    }   
  });
}
var info = getArgs(process.argv);

switch (info.platform) {
  case 'jenkins':
    readPackage(function (err, package) {
      if (err) {
        console.log(err);
        return false;
      }
      var job = package.repository.job || null;
        jenkins.status({
          job: job,
          user: info.user,
          pass: info.pass
        });
    });
    break;
  case 'bamboo':
    readPackage(function (err, package) {
      if (err) {
        console.log(err);
        return false;
      }
      var job = package.repository.job || null;
        bamboo.status({
          job: job,
          user: info.user,
          pass: info.pass,
          branch: info.branch
        });
    });
    break;
  case 'travis':
    console.log('not implemented');
    break;
  default:
    console.log('no CI server configured');
    break;
}