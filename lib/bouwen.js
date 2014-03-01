var jenkins = require('./plugins/jenkins/index')
  , bamboo = require('./plugins/bamboo/index')
  , fs = require('fs')
  , argv = require('minimist')(process.argv.slice(2));

if (argv.h) {
  var title =
    '\n' +
      '▀█████████▄▄██████▄  ███    █▄   ▄█     █▄     ▄████████ ███▄▄▄▄\n' +
      '███    ███ ███    ███ ███    ███ ███     ███   ███    ███ ███▀▀▀██▄\n' +
      '███    ███ ███    ███ ███    ███ ███     ███   ███    █▀  ███   ███\n' +
      '▄███▄▄▄██▀ ███    ███ ███    ███ ███     ███  ▄███▄▄▄     ███   ███\n' +
      '███▀▀▀██▄  ███    ███ ███    ███ ███     ███ ▀▀███▀▀▀     ███   ███\n' +
      '███    ██▄ ███    ███ ███    ███ ███     ███   ███    █▄  ███   ███\n' +
      '███    ███ ███    ███ ███    ███ ███ ▄█▄ ███   ███    ███ ███   ███\n' +
      '▄█████████▀ ▀██████▀  ████████▀   ▀███▀███▀    ██████████▀█    █▀\n\n';

  var usage = 'usage: bouwen [-s jenkins|bamboo] [-u username] [-p password] [-b branch]\n';

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
    if (!package.repository) callback('Missing repository property');
    if (!package.repository.job) callback('Missing repository.job property');

    var job = package.repository.job;
    var jobLen = job.length - 1;
    if (job[jobLen] == '/') {
      job = job.substring(0, jobLen);
    }
    callback(null, job);
  });
}

readPackage(function (err, job) {
  if (err) {
    if (argv.d) {
      console.log(err);
    }
    return;
  }
  if (argv.s) {
    main(argv.s, job);
    return;
  }
  jenkins.isJenkins(job, function (isJenkins) {
    if (isJenkins) {
      main('jenkins', job);
    }
  });
  bamboo.isBamboo(job, function (isBamboo) {
    if (isBamboo) {
      main('bamboo', job);
    }
  });
});

function main(system, job) {
  switch (system) {
    case 'jenkins':
      jenkins.status({
        job: job,
        user: argv.u,
        pass: argv.p
      }, console.log);
      break;
    case 'bamboo':
      bamboo.status({
        job: job,
        user: argv.u,
        pass: argv.p,
        branch: argv.b
      }, console.log);
      break;
    case 'travis':
      console.log('not implemented');
      break;
    default:
      console.log('unknown CI server');
      break;
  }
}