"use strict";
import jwt from 'jsonwebtoken';
const User = require('../models/User');

const facebookController = {

  loginCallback: (req, res) => {
    const facebookUser = req.body;
    const idArray = facebookUser.friends.data.map(friend => friend.id);

    console.log(facebookUser);

    // See if User already exists
    User.findOne({ 'facebook.id': facebookUser.id })
      // Find or Create
      .then(user => {
        // If one does
        if (user) {
          return user;
        }
        // Else
        else {
          // Save new User
          const newUser = new User({
            facebook: {
              id: facebookUser.id,
              displayName: facebookUser.name,
              picture: facebookUser.picture.data.url
            }
          });
          return newUser.save();
        }
      })
      // Update friends list
      .then(user => {
        return User.find({
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
            return User.findOneAndUpdate({ 'facebook.id': facebookUser.id },
              { 'facebook.friends': friendsIdArray },
              { new: true })
              .populate('facebook.friends');
          })
      })
      // Return sanitized User with a token
      .then(user => {
        res.status(200).send({
          token: jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            _id: user._id
          }, process.env.JWT_SECRET),
          user: {
            displayName: user.facebook.displayName,
            place: user.place,
            friends: user.facebook.friends.map(friend => {
              return {
                facebook: friend.facebook,
                place: friend.place
              };
            })
          }
        });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  },

  requireAuth: (req, res, next) => {
    const token = req.get('authorization');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err && err.name === 'TokenExpiredError') {
        res.status(401).send(err);
      } else if (err) {
        res.status(500).send(err);
      } else {
        User.findOne({ _id: decoded._id })
          .populate('facebook.friends')
          .lean()
          .exec()
          .then(user => {
            if (user) {
              // Sanitize user's facebook friends data
              user.facebook.friends = user.facebook.friends.map(friend => {
                return {
                  facebook: friend.facebook,
                  place: friend.place
                };
              });
              req.user = user;
              req.token = token;
              next();
              return null;
            } else {
              res.status(401).send('No user found');
            }
          })
          .catch(err => {
            res.status(500).send(err);
          });
      }
    });
  },

  me: (req, res) => {
    const authUser = req.user;
    const token = req.token;

    User.findOne({ _id: authUser._id })
      .populate('facebook.friends')
      .lean()
      .then(user => {
        // If a user DOES exist, return token and sanitized user info
        if (user) {
          res.status(200).send({
            token,
            user: {
              displayName: user.facebook.displayName,
              place: user.place,
              friends: user.facebook.friends.map(friend => {
                return {
                  facebook: friend.facebook,
                  place: friend.place
                };
              })
            }
          });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  },

  webhook: (req, res) => {
    if (req.query['hub.verify_token'] === process.env.VERIFICATION_TOKEN) {
      console.log('Verified webhook');
      console.log(req.query);
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error('Verification failed. The tokens do not match.');
      res.sendStatus(403);
    }
  }

};

export default facebookController;
