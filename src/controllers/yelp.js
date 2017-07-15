"use strict";
import yelp from 'yelp-fusion';
import YelpToken from '../models/YelpToken';
import User from '../models/User';
// import jwt from 'jsonwebtoken';

const yelpController = {

  refreshAccessToken: (req, res) => {
    let accessToken;
    let expiresIn;

    yelp.accessToken(process.env.YELP_CLIENT_ID, process.env.YELP_CLIENT_SECRET)
      .then(response => {
        // TODO: Error checking
        accessToken = response.jsonBody.access_token;
        expiresIn = response.jsonBody.expires_in;
        return YelpToken.find({});
      })
      .then(tokens => {
        let promise;
        // TODO: Encrypt data inside JWT before saving
        if (!tokens[0]) {
          const newToken = new YelpToken({ access_token: accessToken });
          promise = newToken.save();
        } else if (tokens[0].access_token !== accessToken) {
          promise = tokens[0].update({
            access_token: accessToken,
            expires_at: new Date(Date.now() + expiresIn)
          });
        }
        return promise;
      })
      .then(() => {
        res.status(200).send('token saved');
      })
      .catch(err => {
        res.status(500).send(err);
      });
  },

  search: (req, res) => {
    let accessToken;

    YelpToken.find()
      .then(tokens => {
        // TODO: Error checking
        return accessToken = tokens[0].access_token;
      })
      // TODO: Check expiration
      .then(token => {
        const client = yelp.client(token);

        return client.search({
          term: req.body.term,
          categories: req.body.categories,
          location: req.body.location,
          latitude: req.body.latitude,
          longitude: req.body.longitude
        });
      })
      .then(response => {
        res.status(200).send(response.jsonBody);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  },

  confirm: (req, res) => {
    User.findOneAndUpdate({ '_id': req.user._id },
      { $set: { place: req.params.id }},
      { new: true })
      .then(user => {
        res.status(200).json({
          place: user.place,
          displayName: user.facebook.displayName
        });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }

};

export default yelpController;
