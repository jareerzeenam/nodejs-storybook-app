const express = require('express');
const dotenv = require('dotenv');
//morgan login
const morgan = require('morgan');
// express handle bar template engine
const exphbs = require('express-handlebars');

const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

// Connect to db
connectDB();

const app = express();

// Handlebars
app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
