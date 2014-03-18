#Bouwen

### Installation
```
npm install -g bouwen
```
### What does it do?
It grabs the latest build status from Jenkins, Bamboo or Travis (WIP).
### Why is it called bouwen?
Was pasting random words into google translate and it looked pretty cool. Translates to build from Dutch according to Google.
### How do I use it?
It is a CLI plugin. Just type bouwen from your project root.

Make sure you have added the job url to the 'repository' object in your package.json

__Jenkins__: http://jenkinsUrl.com/job/projectname

__Bamboo__: http://bambooUrl.com/rest/api/latest/plan/{PROJECT-KEY}-{BUILD-KEY}/branch

It should look something like this
```
'repository': {
    'job': 'http://jenkinsUrl.com/job/projectname'
}
```
### Usage
```
bouwen -s {CI name} -u {username (Optional)} -p {password (Optional)} -b {branch(Optional)} -d #shows errors
```
### What should I do with it?
I created it to show the build status in my terminal while working on the project.

### What it looks like
![Terminal example](https://dl.dropboxusercontent.com/u/92547641/bash-build.png)