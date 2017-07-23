"use strict";
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

  app.post('/facebook/login', facebook.loginCallback);

  app.get('/me', facebook.requireAuth, facebook.me);

  app.get('/webhook', facebook.webhook);

  //=======
  // Yelp
  //=======

  app.get('/yelp/access', yelp.refreshAccessToken);

  app.post('/yelp/search', yelp.search);

  app.post('/yelp/confirm/:id', facebook.requireAuth, yelp.confirm);

  app.get('/yelp/place/:id', yelp.getPlaceById);

};

export default routes;
