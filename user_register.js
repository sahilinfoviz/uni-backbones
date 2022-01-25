const express = require('express');
const pool = require('./db/db_config');
const {testEmail, testPhone, testPassword } = require('./utils/regex')
const bcrypt = require('bcrypt');
const { response } = require('express');

const router = express.Router();



//FOR REGISTRATION
router.post('/register', async (req, res) => {
    try{
        const { email, phone, mySecret } = req.body;
        const finalResult = await pool.query('INSERT INTO users (email,phone,mySecret) VALUES ($1,$2,$3) RETURNING *',
                                [email,phone, mySecret]);
        res.json(finalResult.rows[0])
    }catch(err){
        res.status(500).json('registration unsuccessful');
    }
})

module.exports = router;