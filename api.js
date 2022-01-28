const express = require('express');
const compression = require('compression');
const xss = require('xss');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const registerRouter = require('./user_register');
const loginRouter = require('./Auth1/login');
const myRoutes = require('./Auth1/route');
const csrf = require('csurf');
const csrfProtection = csrf({
    cookie: true
});

const app = express();
app.use(compression());
app.use(xss());
app.use(helmet());

const corsOptions = { credentials: true, origin: process.env.URL || '*' };
app.use(cors(corsOptions));
app.use(cors());
// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/new',registerRouter);
app.use('/api',loginRouter);

app.get('/welcome', (req, res) => {
    res.json({ message: 'Express is up!' });
  })
const checkJwt = jwt({
    secret: process.env.JWT_SECRET,
    getToken: req => req.cookies.token,
    algorithms: ['HS256']
});

app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/v1',checkJwt,myRoutes);

module.exports = app;

