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
I created it to show the build status in my terminal while working on the project. Here is a snippet of code to paste into your .bashrc or .bash_profile

This is a bash file I found on github and thought it was pretty cool. In the gitinfo function you'll see how to use bouwen.
```
# @gf3’s Sexy Bash Prompt, inspired by “Extravagant Zsh Prompt”                                                                                                                      
# Shamelessly copied from https://github.com/gf3/dotfiles                                                                                                                            

default_username=‘user’

if [[ $COLORTERM = gnome-* && $TERM = xterm ]] && infocmp gnome-256color >/dev/null 2>&1; then
    export TERM=gnome-256color
elif infocmp xterm-256color >/dev/null 2>&1; then
    export TERM=xterm-256color
fi

if tput setaf 1 &> /dev/null; then
    tput sgr0
    if [[ $(tput colors) -ge 256 ]] 2>/dev/null; then
        MAGENTA=$(tput setaf 9)
        ORANGE=$(tput setaf 172)
        GREEN=$(tput setaf 190)
        PURPLE=$(tput setaf 141)
        WHITE=$(tput setaf 256)
        else
        MAGENTA=$(tput setaf 5)
        ORANGE=$(tput setaf 4)
        GREEN=$(tput setaf 2)
        PURPLE=$(tput setaf 1)
        WHITE=$(tput setaf 7)
        fi
    BOLD=$(tput bold)
    RESET=$(tput sgr0)
else
    MAGENTA="\033[1;31m"
    ORANGE="\033[1;33m"
    GREEN="\033[1;32m"
    PURPLE="\033[1;35m"
    WHITE="\033[1;37m"
    BOLD=""
    RESET="\033[m"
fi
function git_info() {
    # check if we're in a git repo                                                                                                                                                   
    git rev-parse --is-inside-work-tree &>/dev/null || return
    # quickest check for what branch we're on                                                                                                                                        
    branch=$(git symbolic-ref -q HEAD | sed -e 's|^refs/heads/||')
    passing=$(bouwen bamboo user pass ${branch})
    # for jenkins passing=$(bouwen jenkins user pass)
    # the jenkins plugin will only show master branch atm
    # check if it's dirty (via github.com/sindresorhus/pure)                                                                                                                         
    dirty=$(git diff --quiet --ignore-submodules HEAD &>/dev/null; [ $? -eq 1 ]&& echo -e "*")

    echo $WHITE" on "$PURPLE$branch$dirty" - build "$passing
}

# Only show username/host if not default                                                                                                                                             
function usernamehost() {
    if [ $USER ]; then echo "${MAGENTA}$USER ${WHITE}at ${ORANGE}$HOSTNAME $WHITEin "; fi
}

# iTerm Tab and Title Customization and prompt customization                                                                                                                         
# http://sage.ucsc.edu/xtal/iterm_tab_customization.html                                                                                                                             

# Put the string " [bash]   hostname::/full/directory/path"                                                                                                                          
# in the title bar using the command sequence                                                                                                                                        
# \[\e]2;[bash]   \h::\]$PWD\[\a\]                                                                                                                                                   

# Put the penultimate and current directory                                                                                                                                          
# in the iterm tab                                                                                                                                                                   
# \[\e]1;\]$(basename $(dirname $PWD))/\W\[\a\]                                                                                                                                      

PS1="\[\e]2;$PWD\[\a\]\[\e]1;\]$(basename "$(dirname "$PWD")")/\W\[\a\]${BOLD}\$(usernamehost)\[$GREEN\]\w\$(git_info)\[$WHITE\]\n\$ \[$RESET\]"
```
Using this bash script, it will run on every command.
### What it looks like
![Terminal example](https://dl.dropboxusercontent.com/u/92547641/bash-build.png)