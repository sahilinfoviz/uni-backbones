require('newrelic');
const express = require('express');

const compression = require('compression');
const xss = require('xss-clean');
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
const rateLimit = require('express-rate-limit');
const csrfProtection = csrf({
    cookie: true
});
const limiter = rateLimit({
    max: 100,// limit each IP to 100 max requests
    windowMs: 60 * 60 * 1000, // 1 Hour
    message: 'Too many requests' // message to send
});

const app = express();
app.disable("x-powered-by");
app.use(compression());

app.use(helmet());
app.use(xss());

const corsOptions = { credentials: true, origin: process.env.URL || '*' };
app.use(cors(corsOptions));
app.use(cors());
// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter)


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

  


