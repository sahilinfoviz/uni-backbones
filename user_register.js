const express = require('express');
const pool = require('./db/db_config');
const {testEmail, testPhone, testPassword } = require('./utils/regex')
const logger = require('./logger');
const sentry = require('./sentry_config');
const bcrypt = require('bcryptjs');

const router = express.Router();



//FOR REGISTRATION
router.post('/register', async (req, res) => {
    try{
        const { firstName, lastName, email, phone, password, isTeacher, isStudent } = req.body;
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
                                const myResult = await pool.query('SELECT * FROM users WHERE phone = $1',[phone]);
                                if(myResult.rows.length === 0){
                                const finalResult = await pool.query('INSERT INTO users (firstName,lastName,email,phone,password) VALUES ($1,$2,$3,$4,$5) RETURNING *',
                                [firstName,lastName,email,phone,hashedPassword]);
                                await pool.query('INSERT INTO roles (id, isStudent, isTeacher) VALUES ($1,$2,$3) RETURNING *',[finalResult.rows[0].id,isStudent,isTeacher]);
                                logger.info(`user ${finalResult.rows[0].firstname} successfully registered`);
                                return res.json('successfully registered')
                                } else{
                                    sentry.captureMessage('phone number already exists')
                                    logger.warn('phone number already exists');
                                    return res.json('phone number already exists');
                                }     
                            } else{
                                sentry.captureMessage('phone number is not in valid format');
                                logger.warn('phone number is not in valid format');
                                return res.json('phone number is not in valid format');
                            } 
                        } else{
                            sentry.captureMessage('password is not in valid format');
                            logger.warn('password is not in valid format');
                            return res.json('password is not in valid format');
                        }
                    }
                    else{
                        sentry.captureMessage('email already exists');
                        logger.warn('email already exists');
                        return res.json('email already exists');
                    }        
                }
                else{
                    sentry.captureMessage('email is not in valid format');
                    logger.warn('email is not in valid format');
                    return res.json('email is not in valid format');
                }
        }
        else{
            sentry.captureMessage('email or phone or password field can not be empty');
            logger.warn('email or phone or password field can not be empty');
            return res.json('email or phone or password field can not be empty');
        }
    }catch(err){
        sentry.captureException(err);
        logger.error(err);
        res.status(500).json('registration unsuccessful');
    }
})

module.exports = router;