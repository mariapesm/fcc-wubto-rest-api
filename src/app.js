require('dotenv').config({ silent: true });
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import connectMongo from './databases/connectMongo';

// MongoDB Setup
connectMongo();

// Express App setup
const app = express();

// Middleware for logging
app.use(morgan('combined'));

// Middleware parses incoming requests into JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

// CORS Middleware for handling requests coming from different IPs/ports
app.use(cors());

// Pass in our app to make it available to all routes
routes(app);

export default app;
