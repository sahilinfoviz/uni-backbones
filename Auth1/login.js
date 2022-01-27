const express = require('express');
require('dotenv').config();
const myJwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const jwtDecode = require('jwt-decode');
const db = require('../db/db_config');
const bcrypt = require('bcryptjs/dist/bcrypt');
const app = express();
app.use(cookieParser());



app.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await db.query('SELECT * FROM users WHERE email = $1',[email]);
        if(!user){
            return res.status(403).json({message: "wrong email or password"});
        }
        const myRoles = await db.query('SELECT * FROM roles WHERE id = $1',[user.rows[0].id]);
        let role
        if (myRoles.rows[0].isteacher === true)
            role = 'teacher';
        else role = 'student';
        const passwordValidate = await bcrypt.compare(password,user.rows[0].password);
        if(passwordValidate) {
            const data = {
                fistname: user.rows[0].firstname,
                lastname: user.rows[0].lastname,
                id: user.rows[0].id,
                phone: user.rows[0].phone,
                userRole: role
            };
            const userInfo = Object.assign({},data);
            const token = myJwt.sign(userInfo,process.env.JWT_SECRET,{ algorithm: 'HS256', expiresIn: '1h'});

            const decodedToken = jwtDecode(token);
            const expiresAt = decodedToken.exp;
            res.cookie('token', token, {
                httpOnly: true
            });
            res.json({
                message: 'Authentication Successful',
                userInfo,
                expiresAt
            });
        } else {
            res.status(403).json({
                message: 'wrong email or password.'
            });
        }
    }catch(err) {
        console.log(err);
        return res.status(400)
                  .json({message: 'Something went wrong.'});
    }
});




module.exports = app;