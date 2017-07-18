"use strict";
import passport from 'passport';
// const Strategy = require('passport-facebook').Strategy;
import { Strategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';
const User = require('../models/User');
require('dotenv').config({ silent: true });

// Facebook strategy
const facebookStrategy = new Strategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_LOGIN_CALLBACK,
    profileFields: ['friends', 'displayName']
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.

    // Get friends list with their places info
    const { friends } = profile._json;
    const idArray = friends.data.map(friend => friend.id);

    User.find({
      'facebook.id': {
        $in: idArray
      }
    })
      .lean()
      .then(users => {
        return users.map(user => {
          return { _id: user._id };
        });
      })
      .then(friendsIdArray => {
        // See if a user with the given Facebook id exists
        return User.findOneAndUpdate({ 'facebook.id': profile.id },
          { 'facebook.friends': friendsIdArray },
          { new: true })
          .populate('facebook.friends');
      })
      .then(user => {
        // If a user DOES exist, return token and whitelisted user info
        if (user) {
          // Could update the user here if we wanted
          // user.save();
          return cb(null, {
            token: jwt.sign({
              exp: Math.floor(Date.now() / 1000) + (60 * 60),
              _id: user._id,
              displayName: user.facebook.displayName,
              friends: user.facebook.friends
            }, process.env.JWT_SECRET)
          });
        }
        else {
          // Else, create new user and return token
          const newUser = new User({
            facebook: {
              id: profile.id,
              displayName: profile.displayName,
              friends: friendsArray
            }
          });
          return newUser
            .save()
            .then((user) => {
              return cb(null, {
                token: jwt.sign({
                  exp: Math.floor(Date.now() / 1000) + (60 * 60),
                  _id: user._id,
                  displayName: user.facebook.displayName,
                  friends: user.facebook.friends
                }, process.env.JWT_SECRET)
              });
            })
            .catch(cb);
        }
      })
      .catch(cb);
  });

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Tell passport to use this strategy
passport.use(facebookStrategy);
