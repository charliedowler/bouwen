# Bouwen [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

### Installation
```
npm install -g bouwen
```
### What does it do?
It grabs the latest build status from Jenkins, Bamboo or Travis (WIP).
### Why is it called bouwen?
Was pasting random words into google translate and it looked pretty cool. Translates to build from Dutch according to Google.
### Configuration
You can store your login details in environment variables. Then you can use bouwen without the login params.
The format is {HOSTNAME}_USERNAME && {HOSTNAME}_PASSWORD
```shell
$ export travis-ci_USERNAME=user
$ export travis-ci_PASSWORD=p4ssword
$ cd IntoTravisCIProject
$ bouwen
```
### How do I use it?
It is a CLI plugin. Just type bouwen from your project root.

Make sure you have added the job url to the 'repository' object in your package.json

__Jenkins__: http://jenkinsUrl.com/job/projectname

__Bamboo__: http://bambooUrl.com/rest/api/latest/plan/{PROJECT-KEY}-{BUILD-KEY}/branch

__Travis__: https://api.travis-ci.org/repositories/{USERNAME}/{REPO-NAME}

It should look something like this
```
'repository': {
    'job': 'http://jenkinsUrl.com/job/projectname'
}
```
### Usage
```
bouwen -s {CI name} -j {job-url (Optional)} -u {username (Optional)} -p {password (Optional)} -b {branch(Optional)} -d #shows errors
```
### What should I do with it?
I created it to show the build status in my terminal while working on the project.

### What it looks like
![Terminal example](https://dl.dropboxusercontent.com/u/92547641/bash-build.gif)

[npm-url]: https://npmjs.org/package/bouwen
[npm-image]: https://badge.fury.io/js/bouwen.png

[travis-url]: http://travis-ci.org/charliedowler/bouwen
[travis-image]: https://secure.travis-ci.org/charliedowler/bouwen.png?branch=master

[depstat-url]: https://david-dm.org/charliedowler/bouwen
[depstat-image]: https://david-dm.org/charliedowler/bouwen.png