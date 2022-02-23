# Node.js Story Book App

## [Tutorial](https://youtu.be/SBvmnHTQIPY)

### Add the below scripts to packages.json when deploying to heroku 

`  "scripts": {
    "start": "node app.js",
    "heroku-postbuild":"NPM_CONFIG_PRODUCTION=false"
  },`