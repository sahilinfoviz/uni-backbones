const express = require('express');
const pool = require('./db/db_config');
const {testEmail, testPhone, testPassword } = require('./utils/regex')
const bcrypt = require('bcrypt');
const { response } = require('express');

const router = express.Router();



//FOR REGISTRATION
router.post('/register', async (req, res) => {
    try{
        const { email, phone, password, isTeacher, isStudent } = req.body;
        const saltRounds = 12;
        const salt = bcrypt.genSaltSync(saltRounds);
        if(email && phone && password){
            if(testEmail(email)){
                const result = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
                    if (result.rows.length === 0)
                    {
                        if(testPassword(password)){
                            const hashedPassword = await bcrypt.hash(password, salt);
                            if(testPhone(phone)){
                                const result = await pool.query('INSERT INTO users (email,phone,password) VALUES ($1,$2,$3) RETURNING *',
                                [email,phone,hashedPassword]);
                                await pool.query('INSERT INTO roles (id, isStudent, isTeacher) VALUES ($1,$2,$3) RETURNING *',[result.rows[0].id,isStudent,isTeacher])
                                res.json('successfully registered')
                                } else return res.json('phone number is not in valid format');
                        } else return res.json('password is not in valid format');
                    }
                    else return res.json('email already exists');        
                }
                else return res.json('email is not in valid format');
        }
        else return res.json('email or phone or password field can not be empty')
    }catch(err){
        res.status(500).json('registration unsuccessful');
    }
})

module.exports = router;