/* eslint-disable no-console */
import chalk from 'chalk';
require('dotenv').config({ silent: true });

console.log(chalk.green('Starting app in'),
  chalk.blue(process.env.NODE_ENV),
  chalk.green('mode...'));
