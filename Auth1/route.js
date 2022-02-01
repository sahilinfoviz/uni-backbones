const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const jwtDecode = require('jwt-decode');
const db = require('../db/db_config');
const logger = require('../logger');
const sentry = require('../sentry_config');
const app = express();
app.disable("x-powered-by");
app.use(cookieParser());


const attachUser = (req, res, next) => {
    const token =  req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: 'authentication invalid'})
    }
    const decodedToken = jwtDecode(token);
    if(!decodedToken) {
        return res.status(401).json({ message: 'There is a problem authorizing '})
    } else {
        req.user = decodedToken;
        next();
    }
}

app.use(attachUser);

const requireTeacher = (req, res, next) => {
    const {userRole} = req.user;
    if (userRole !== 'teacher') {
        return res.status(401).json({ message: 'insufficient role' });
    }
    next();
}

app.get('/usersList',requireTeacher, async (req,res) => {
    try{
        const listData = await db.query('SELECT firstName,lastName,email,phone FROM user');
        res.status(200).json(listData.rows);
    } catch(err) {
        sentry.captureException(err);
        logger.error(err);
        return res.status(400)
                  .json({message: 'Something went wrong.'});
    }
});

app.post('/randomData',requireTeacher, (req,res) => {
    try{
        res.status(200).json({message: 'you are welcome'});
    } catch(err) {
        sentry.captureException(err);
        logger.error(err);
        return res.status(400)
                  .json({message: 'Something went wrong.'});
    }
});


module.exports = app;