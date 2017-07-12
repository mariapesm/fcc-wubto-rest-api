"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
  facebook: {
    id: {
      type: String,
      required: true
    },
    displayName: {
      type: String
    },
  },
  metaData: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    }
  },
  active: {
    type: Boolean,
    default: true
  }
});

// Create the model class
const ModelClass = mongoose.model('User', userSchema);

// Export the model
module.exports = ModelClass;
