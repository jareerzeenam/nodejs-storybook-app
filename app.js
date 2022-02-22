const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//morgan login
const morgan = require('morgan');
// express handle bar template engine
const { engine } = require('express-handlebars');

//Passport
const passport = require('passport');
//Express Session
const session = require('express-session');

// handle on reload redirects back to login issue by saving a session on db
const MongoStore = require('connect-mongo');

const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

//Passport Config (Authenticate user)
require('./config/passport')(passport);

// Connect to mongo db
connectDB();

const app = express();

//Logging
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//Handlebars (template engine)
app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

//Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//! Static folder
app.use(express.static(path.join(__dirname, 'public')));

//! Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
