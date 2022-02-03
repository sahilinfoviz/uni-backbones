require("newrelic");
const express = require("express");
const responseTime = require("response-time");
const compression = require("compression");
const xss = require("xss-clean");
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("express-jwt");
const cookieParser = require("cookie-parser");
const registerRouter = require("./user_register");
const loginRouter = require("./Auth1/login");
const myRoutes = require("./Auth1/route");
const csrf = require("csurf");
const slowDown = require("express-slow-down");
const csrfProtection = csrf({
  cookie: true,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 100:
});


const app = express();
app.disable("x-powered-by");
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
app.use(compression());
app.use(helmet());
app.use(xss());
const corsOptions = { credentials: true, origin: process.env.URL || "*" };
app.use(cors(corsOptions));
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseTime());
app.use(speedLimiter);


app.use("/new", registerRouter);
app.use("/api", loginRouter);

app.get("/welcome", (req, res) => {
  res.json({ message: "Express is up!" });
});
const checkJwt = jwt({
  secret: process.env.JWT_SECRET,
  getToken: (req) => req.cookies.token,
  algorithms: ["HS256"],
});

app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api/v1", checkJwt, myRoutes);

module.exports = app;
