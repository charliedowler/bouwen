'use strict';
var assert = require('assert');
var isUp = require('is-up');
var isTravis = require('is-travis');
var exec = require('child_process').exec;

it('Should see that the bouwen build is either STARTED | PASSED | FAILED', function(done) {
  isUp('google.com', function(err, up) {
    if (err || !up) done();
    exec('node ./bin/bouwen -j https://api.travis-ci.org/repositories/charliedowler/bouwen', function(err, stdout, stderr) {
      var status = (/PASSED/.test(stdout)) ? 'PASSED\n' : 'FAILED\n';
      assert.equal(stdout, isTravis ? 'STARTED\n' : status);
      done();
    })
  })
});