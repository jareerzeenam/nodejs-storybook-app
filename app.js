const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
//morgan login
const morgan = require('morgan');
// express handle bar template engine
const { engine } = require('express-handlebars');

const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

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

//! Static folder
app.use(express.static(path.join(__dirname, 'public')));

//! Routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
