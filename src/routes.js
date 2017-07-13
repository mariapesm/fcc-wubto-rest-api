"use strict";
import passportService from './services/passport'; // eslint-disable-line no-unused-vars
import passport from 'passport';
import facebook from './controllers/facebook';
import yelp from './controllers/yelp';

const routes = (app) => {
  // Server index page
  app.get('/', function (req, res) {
    res.send('Deployed!');
  });

  //================
  // Sample Routes
  //================

  // This is a GET route that is open to the world
  app.get('/noauth', function(req, res) {
    res.send({ message: 'no authorization required' });
  });

  //===========
  // Facebook
  //===========

  app.get('/login/facebook',
    passport.authenticate('facebook', { scope: ['user_friends', 'public_profile'] }));

  app.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: `${process.env.WEB_APP_URL}/login` }),
    facebook.loginCallback);

  app.get('/me', facebook.requireAuth, facebook.me);

  app.get('/private', facebook.requireAuth, function(req, res) {
    res.send({ message: 'Secret Code is 789' });
  });

  app.get('/webhook', facebook.webhook);

  //=======
  // Yelp
  //=======

  app.get('/yelp/access', yelp.refreshAccessToken);

  app.post('/yelp/search', yelp.search);

};

export default routes;
