var JenkinsClient = require('./plugins/jenkins/index')
  , BambooClient = require('./plugins/bamboo/index')
  , TravisClient = require('./plugins/travis/index')
  , fs = require('fs')
  , argv = require('minimist')(process.argv.slice(2))
  , URL = require('url');

if (argv.h) {
  var title =
    '\n' +
    '▀█████████ ▄██████▄   ███    █▄   ▄█     █▄     ▄████████ ███▄▄▄▄\n' +
    '███    ███ ███    ███ ███    ███ ███     ███   ███    ███ ███▀▀▀██▄\n' +
    '███    ███ ███    ███ ███    ███ ███     ███   ███    █▀  ███   ███\n' +
    '▄███▄▄▄██▀ ███    ███ ███    ███ ███     ███  ▄███▄▄▄     ███   ███\n' +
    '███▀▀▀██▄  ███    ███ ███    ███ ███     ███ ▀▀███▀▀▀     ███   ███\n' +
    '███    ██▄ ███    ███ ███    ███ ███     ███   ███    █▄  ███   ███\n' +
    '███    ███ ███    ███ ███    ███ ███ ▄█▄ ███   ███    ███ ███   ███\n' +
    '▄█████████▀ ▀██████▀  ████████▀   ▀███▀███▀    ██████████ ▀█    █▀\n\n';

  var usage = 'usage: bouwen [-j job-url] [-s jenkins|bamboo|travis] [-u username] [-p password] [-b branch]\n';

  console.log(title + usage);

  return;
}

function readPackage(callback) {
  fs.readFile(process.cwd() + '/package.json', {
    encoding: 'utf8'
  }, function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    var package = JSON.parse(data);
    if (!package.repository) {
      callback('missing repository property');
      return;
    }
    if (!package.repository.job && !argv.j) {
      callback('missing repository.job property');
      return;
    }

    var job = package.repository.job || argv.j;
    var jobLen = job.length - 1;
    if (job[jobLen] == '/') {
      job = job.substring(0, jobLen);
    }
    callback(null, job);
  });
}

function errorLog(error) {
  if (argv.d) {
    throw new Error(error);
  }
}

readPackage(function (err, job) {
  if (err) {
    errorLog(err);
    return;
  }
  if (argv.s) {
    main(argv.s, job);
    return;
  }
  if (JenkinsClient.isJenkins(job)) {
    main('jenkins', job);
  }
  else if (BambooClient.isBamboo(job)) {
    main('bamboo', job);
  }
  else if (TravisClient.isTravis(job)) {
    main('travis', job);
  }
});

function missingLogin(job) {
  var link = URL.parse(job);
  var hostname = link.hostname.split('.')[0];
  argv.u = process.env[hostname + "_USERNAME"];
  argv.p = process.env[hostname + "_PASSWORD"];
}

function main(system, job) {
  if (!argv.u) {
    missingLogin(job);
  }
  switch (system) {
    case 'jenkins':
      var client = new JenkinsClient(job);
      client.login(argv.u, argv.p, function (err, jenkins) {
        if (err) {
          errorLog(err);
          return false;
        }
        jenkins.getBuildStatus(console.log);
      });
      break;
    case 'bamboo':
      var client = new BambooClient(job, argv.b);
      client.login(argv.u, argv.p, function (err, bamboo) {
        if (err) {
          errorLog(err);
          return false;
        }
        bamboo.getBuildStatus(console.log);
      });
      break;
    case 'travis':
      var client = new TravisClient(job, argv.b);
      client.getBuildStatus(console.log);
      break;
    default:
      console.log('unknown CI server');
      break;
  }
}