# fcc-heroku-rest-api
A REST API built on Express.  
It uses babel during development which allows for writing ES6 and beyond.
NPM scripts for linting, autorestarts and transpiling. Works on Heroku's servers.

## Requirements
- Node requirements
- Mongo requirements
- Heroku requirements (CLI tools)

## Initial Setup
Make sure you have Mongo up and running.  
In a new terminal window
- `git clone https://github.com/zklinger2000/fcc-heroku-rest-api.git`
- `cd fcc-heroku-rest-api`
- `npm install`

### Environment Variables file
Before we try and run the app, we need to create our hidden environment variables file

- `touch .env`
In a text editor, add these entries to the file:
```
PORT=8050
NODE_ENV=development
API_URL=http://localhost:8050
WEB_APP_URL=http://localhost:8000
MONGODB_URI=mongodb://localhost:27017/fcc-heroku-rest-api
JWT_SECRET=makeUpALongStringOfCharsAnd123
FB_CLIENT_ID=xxxxxxxxxxxx
FB_CLIENT_SECRET=xxxxxxxxxxxxx
FB_LOGIN_CALLBACK=http://localhost:8050/login/facebook/return
```

## Facebook Setup
- Create a new web app
- set app variables from facebook in .env file
- Under Facebook Login settings, set Redirect URI to `http://localhost:8050/login/facebook/return`

### Run app in 'development' mode
- `npm run dev:start`
- Open a browser and head to http://localhost:8050
If you see 'Deployed!', then it is running.
> If you get this far without any errors, you basically have a working Express backend in your local dev environment.

## Heroku Setup
### Create Heroku App
From the git project's root directory
- `heroku create some-app-name` // name your app

## Mongo
- Go to the app page on Heroku's website.
- Under 'Resources' install mLab MongoDB

## Update Environment Variables on Heroku
- On the app page under 'Settings' click on 'Reveal Config Vars'
- Add all the keys except MONGODB_URI and PORT.
- Set NODE_ENV to production

- `git push heroku master`
> At this point you should see the build process on Heroku's server. You **should** see 'Build succeeded!' and 'Launching...' at the end of the build process.

