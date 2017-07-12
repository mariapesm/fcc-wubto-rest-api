import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
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

// Express session middleware
app.use(session({
  secret: 'this is a secret',
  resave: true,
  saveUninitialized: true
}));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// CORS Middleware for handling requests coming from different IPs/ports
app.use(cors());

// Pass in our app to make it available to all routes
routes(app);

export default app;
