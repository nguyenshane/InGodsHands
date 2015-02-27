![In-Gods-Hands](http://in-gods-hands.info/logo720x.jpg)
# In God's Hands
In God's Hands is a God game where the player physically pulls strings to manipulate the world to influence its inhabitants. As a God, the player needs to balance the fragile equilibrium that is the inhabitants’ faith by inflicting fear, punishment, rewards, etc.

## Setup development environment
* **Clone** this repo using GitHub command/GUI or SourceTree
* **On Windows:**
  * If not yet installed, download and **install Python 2.7** from https://www.python.org/downloads/
  * Double click on file localserver.bat
* **On Mac/Linux:**
  * Open Terminal/CommandLine, run **'chmod a+x /path/to/file/localserver'**, this will make the file **'localserver'** executable
  * Double click on file localserver
  * If you want to stop this server, hit Ctrl+C and type **'killall Python'**

* Open browser and go to **http://localhost:51000** to verify that the local server is running
* Go to **PlayCanvas.com**, click on Projects -> InGodsHands
* Click on **Editor** and choose a scene
* When you need to play the game with changes at your local machine, choose **Launch (Local Server)**

## Github procedure
* Fork the main repo (nguyenshane/InGodsHands)
* In your favorite git tool (Sourcetree, terminal, etc.) create a new remote with your forked repo
* Whenever implementing a new feature, create a branch with a name describing said feature
* When you're satisfied with your local changes, commit to this Github
* From **PlayCanvas project page**, choose **Code**, check if Github is **green**. If not, click on **sync**
* For the change to show up when Launch without Local Server, the Github commit has to be in master branch
* Remember to **commit frequently!**
* When done working on feature, push to your remote's version of the branch (Matt/feature)
* Go to your repo's page on github.com and you should be able to create a pull request
* If you make additional changes on that branch, when you push them they will append your pull request
* Someone else on the team should checkout your pull request, make sure it works, and merge the pull request
* Success
