const express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');

const pool = require('../db/db_config')

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;
// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;


const getAllUsers = async () => {
    return await pool.query('SELECT * FROM users');
  };
// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
    console.log('payload received', jwt_payload.id);
    let user = await pool.query('SELECT * FROM users WHERE id = $1',[jwt_payload.id]);
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  passport.use(strategy);
  const router = express.Router();


// login route
router.post('/login', async function(req, res, next) { 
  try{
    const { email, password } = req.body;
    if (email && password) {
      let user = await pool.query('SELECT * FROM users WHERE email = $1',[email])
      if (user.rows.length === 0) {
        return res.json('No such user found');
      } else {
        // Valid password check
    const correctPassword = await bcrypt.compare(password, user.rows[0].mysecret);
    if (!correctPassword) return res.json('incorrect password');
    else{
        const result = await pool.query('SELECT * FROM roles where id = $1',[user.rows[0].id]);
        let teacher = result.rows[0].isteacher;
        let student = result.rows[0].isstudent; 
        let payload = user.rows[0];
        let token = jwt.sign(payload, jwtOptions.secretOrKey,{ expiresIn: '30m' });
        res.json({ msg: 'ok', token: token , isTeacher: teacher, isStudent: student});
    }
      } 
    } else {
      return res.json('email or password field can not be empty');
    }
  }catch(err){
        res.status(500).json('login unsuccessful');
  }  
  });
  
// To check PASSPORT authentication strategy working or not 


// To check authorization for teacher role

router.get('/myProfile/:email',passport.authenticate('jwt', { session: false }),async function(req, res) {
  try{
    const myParam = req.params.email
    const result = await pool.query('SELECT * FROM users WHERE email = $1',[myParam]);
    const myRole = await pool.query('SELECT * FROM roles WHERE id = $1',[result.rows[0].id]);
    if(myRole.rows[0].isstudent === true){
    return res.status(200).json(result.rows[0]); 
    }
    else return res.json('not authorized to perform this action')
  }catch(err){
    res.status(500).json('error ocurred')
  }
  })

  // To check authorization for student role


  router.get('/allUser/:email',passport.authenticate('jwt', { session: false }),async function(req, res) {
    try{
      const myParam = req.params.email
      const result = await pool.query('SELECT * FROM users WHERE email = $1',[myParam]);
      const myRole = await pool.query('SELECT * FROM roles WHERE id = $1',[result.rows[0].id])
      if(myRole.rows[0].isteacher === true){
        getAllUsers().then(user => res.status(200).json(user.rows)); 
      }
      else return res.json('not authorized to perform this action')
    }catch(err){
      res.status(500).json('error ocurred')
    }
    })

  module.exports = router;
