const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//morgan login
const morgan = require('morgan');
// express handle bar template engine
const { engine } = require('express-handlebars');
// uses this package to edit story
const methodOverride = require('method-override');
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

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Logging
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//Handlebars Helpers
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require('./helpers/hbs');

//!Handlebars (template engine)
app.engine(
  '.hbs',
  engine({
    helpers: { formatDate, truncate, stripTags, editIcon, select },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
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

// Set Global Express Variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//! Static folder
app.use(express.static(path.join(__dirname, 'public')));

//! Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
