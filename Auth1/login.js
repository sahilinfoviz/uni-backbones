const express = require("express");
const { validationResult, body } = require("express-validator");
require("dotenv").config();
const myJwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const jwtDecode = require("jwt-decode");
const axios = require("axios");
const db = require("../db/db_config");
const logger = require("../logger");
const sentry = require("../sentry_config");
const bcrypt = require("bcryptjs/dist/bcrypt");

const app = express();
app.disable("x-powered-by");
app.use(cookieParser());

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// For login route

app.post(
  "/login",
  // for validating input
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    // get recaptcha token
    if (!req.body.token) {
      return res.status(400).json({ error: "reCaptcha token is missing" });
    }
    try {
      // verify recaptcha token
      const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RE_CAPTCHA_SECRET}&response=${req.body.token}`;
      const response = await axios.post(googleVerifyUrl);
      const { success } = response.data;
      if (success) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await db.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);
        // for checking if user exists
        if (user.rows.length === 0) {
          sentry.captureMessage("wrong email or password");
          logger.error("wrong email or password");
          return res.status(403).json({ error: "wrong email or password" });
        } else {
          // getting the role of logged in user
          const myRoles = await db.query("SELECT * FROM roles WHERE id = $1", [
            user.rows[0].id,
          ]);
          if (myRoles.rows[0].isteacher === true) {
            var role = "teacher";
          } else role = "student";
          // validating password for login
          const passwordValidate = await bcrypt.compare(
            password,
            user.rows[0].password
          );
          if (!passwordValidate) {
            sentry.captureMessage("wrong email or password");
            logger.error("wrong email or password");
            return res.status(403).json({ error: "wrong email or password" });
          } else {
            // generating payload
            const data = {
              fistName: user.rows[0].firstname,
              lastName: user.rows[0].lastname,
              id: user.rows[0].id,
              userRole: role,
            };
            const userInfo = Object.assign({}, data);
            // generating token
            const token = myJwt.sign(userInfo, process.env.JWT_SECRET, {
              algorithm: "HS256",
              expiresIn: "1h",
            });
            // decoding token for getting expiry time
            const decodedToken = jwtDecode(token);
            const expiresAt = decodedToken.exp;
            res.cookie("token", token, {
              httpOnly: true,
            });
            console.log(token);
            res.json({
              message: "Authentication Successful",
              userInfo,
              expiresAt,
            });
          }
        }
      } else {
        sentry.captureMessage("Invalid Captcha. Try again.");
        logger.error("Invalid Captcha. Try again.");
        return res.status(400).json({ error: "Invalid Captcha. Try again." });
      }
    } catch (err) {
      sentry.captureException(err);
      logger.error(err);
      return res.status(400).json({ error: "Something went wrong." });
    }
  }
);


// API FOR GOOGLE SIGN IN

app.post('/google-login', async (req, res) => {
  const token = req.body.tokenId;
  console.log(token);
  try{

    // verify the google sign in token
    const ticket = await client.verifyIdToken({ idToken: token });
    let payload = ticket.getPayload();
    console.log(payload);
      const { email_verified } = payload;
      if (email_verified) {

        // check if the user exists 
        const user = await db.query('SELECT * FROM users WHERE email = $1', [payload.email]);
        if (user.rows.length === 0) {
          sentry.captureMessage('Invalid Credential');
          logger.warn('Invalid Credential');
          return res.status(401).json({error: 'Invalid Credential'});
        }
        else {
          const myRoles = await db.query("SELECT * FROM roles WHERE id = $1", [
            user.rows[0].id,
          ]);
          if (myRoles.rows[0].isteacher === true) {
            var role = "teacher";
          } else role = "student";
          // generating payload for access token
          const data = {
            fistName: user.rows[0].firstname,
            lastName: user.rows[0].lastname,
            id: user.rows[0].id,
            userRole: role,
          };
          const userInfo = Object.assign({}, data);
          // generating token
          const token = myJwt.sign(userInfo, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "1h",
          });
           // decoding token for getting expiry time
          const decodedToken = jwtDecode(token);
          const expiresAt = decodedToken.exp;
          res.cookie("token", token, {
            httpOnly: true,
          });
          console.log(token);
          res.json({
            message: "Authentication Successful",
            userInfo,
            expiresAt,
          });
        }
      } else {
        sentry.captureMessage('Google login failed. Try again');
        logger.warn('Google login failed. Try again');
        return res.status(400).json({
          error: 'Google login failed. Try again',
        });
      }
  }catch (err) {
    sentry.captureException(err);
    logger.error(err);
    return res.status(400).json({ error: "Something went wrong." });
  }
});


// API FOR LOGOUT

app.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "User logged out successfully" });
    logger.info("User logged out successfully");
  } catch (err) {
    sentry.captureException(err);
    logger.error(err);
    return res.status(400).json({ error: "Something went wrong." });
  }
});

module.exports = app;
