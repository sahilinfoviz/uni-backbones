const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

const passport = require('passport');

const userRouter = require('./user_register')
const loginRouter = require('./Auth1/login');

const app = express();
app.use(helmet());

// initialize passport with express
app.use(passport.initialize());

const corsOptions = { credentials: true, origin: process.env.URL || '*' };
app.use(cors(corsOptions));
app.use(cors());
// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/api', userRouter)
app.use('/auth', loginRouter)

// add a basic route
app.get('/welcome', function(req, res) {
    res.json({ message: 'Express is up!' });
  })
  require('dotenv').config();

  const PORT = process.env.PORT;

  module.exports = app;
