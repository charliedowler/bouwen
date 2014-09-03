'use strict';
var assert = require('assert');
var isUp = require('is-up');
var exec = require('child_process').exec;

it('Should see that the bouwen build is STARTED', function(done) {
  isUp('google.com', function(err, up) {
    if (err || !up) done();
    exec('node ./bin/bouwen -j https://api.travis-ci.org/repositories/charliedowler/bouwen', function(err, stdout, stderr) {
      assert.equal(stdout, 'STARTED\n');
      done()
    })
  })
});