"use strict";
/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
import mongoose from 'mongoose';
import chalk from 'chalk';
import bluebird from 'bluebird';

const connectDB = () => {
  mongoose.Promise = bluebird;

  if (process.env.NODE_ENV !== 'test') {
    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_URI, { promiseLibrary: bluebird, useMongoClient: true });

    //============================
    // CONNECTION EVENT LISTENERS
    //============================

    // When successfully connected
    mongoose.connection.on('connected', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(chalk.green('Mongoose connection open to'), chalk.blue(process.env.MONGODB_URI));
      } else {
        console.log(chalk.green('Mongoose connection'), chalk.blue('OPEN'));
      }
    });
    // If the connection throws an error
    mongoose.connection.on('error', err => {
      console.log(chalk.red('Mongoose connection error:', err));
    });
    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log(chalk.yellow('\nMongoose connection disconnected'));
    });
    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log(chalk.yellow('Mongoose connection disconnected through app termination'));
        process.exit(0);
      });
    });
  }
};

export default connectDB;
