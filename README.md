# Univergence

This is the demo folder structure of Backend Project

## Folder Structure

**.github/workflows:** This folder will be use for Git workflow 

**Auth:** This folder will use for Query to DB.

**server.js:** This folder will be use for define APIs.

# UNIVERGENCE

Backend for UNIVERGENCE login module.


# Work flow

1. User registration will be done providing the required details.

2. Then after one can login by using his or her email address and password.

3. After successful login a jwt token and that user's role will be returned.

4. Then after the user can access to other field by using the token.

5. Here for authentication purpose passport-jwt strategy is used.

6. The user will be given access to other fields of the project if 
   he has the jwt token and have permission to access the page as per his or her role.

# API LIST AND STEPS TO FOLLOW
# For welcome
GET /
1. Http://3.108.202.169:3000/welcome
# For register
POST /
2. Http://3.108.202.169:3000/api/register
# For login
POST /
3. Http://3.108.202.169:3000/auth/login
# For getting all users LIST
GET /
4. Http://3.108.202.169:3000/auth/allUser/:email
#Steps to follow

1. If you want to register a user you can add the following details

firstName
lastName
email
phone
password
isTeacher
isStudent

2. During login

email
password

3. For getting all users LIST

-- You have provide the email address and the jwt token

Note - Only the user with role === teacher are authorized to access this field not the users with role === student 

