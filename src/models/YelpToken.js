"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const yelpTokenSchema = new Schema({
  access_token: {
    type: String
  },
  expires_at: {
    type: Date,
    default: () => { return new Date(Date.now() + (60000 * 60 * 24 * 180)) }
  }
});

// Create the model class
const ModelClass = mongoose.model('yelp_token', yelpTokenSchema);

// Export the model
module.exports = ModelClass;
