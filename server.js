var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const helmet = require('helmet');
path = require('path');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(helmet());
app.use(cors());

//set public resorces folder
app.use(express.static(__dirname))

// Get Root Page
app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, '../src/index.html'));
  });



// ------------------------------------USER INFORMATION----------------------------------------
//User Details 
var userinfo = require('./insert/user');
app.use('/user',userinfo);

//User Setup Page
var userDetails = require('./insert/user/userSetup');
app.use('/userDetails',userDetails);

// Photos
var photos=require('./insert/user/photos');
app.use('/photos',photos);


// -------------------------GOOGLE INFORMATION--------------------------------------------------
// Get Google Information
var googleinfo = require('./insert/getgooglesignin');
app.use('/profile',googleinfo);

// Store Google Information
var google = require('./insert/google');
app.use('/google',google);


// ----------------------------TRANSACTIONS-----------------------------------------------------

//Income
var income = require('./insert/transaction/income');
app.use('/income',income);

//Payment
var payment = require('./insert/transaction/payment');
app.use('/payment',payment);

// Transaction
var transaction = require('./insert/transaction/transaction');
app.use('/transaction',transaction);

// Bill Payment
var billpayment = require('./insert/transaction/billaccount');
app.use('/billpayment',billpayment);


//------------------------------------ACCOUNTS----------------------------------------------------
// Account
var account = require('./insert/accounts/account');
app.use('/account',account);

// Bank Account
var bankaccount=require('./insert/accounts/bankaccount');
app.use('/bankaccount',bankaccount);

// Cash Account
var cashaccount=require('./insert/accounts/cashaccount');
app.use('/cashaccount',cashaccount);

// Endownment
var endownment = require('./insert/accounts/endownment');
app.use('/endownment',endownment);

//  Health Insurance
var healthinsurance = require('./insert/accounts/healthinsurance');
app.use('/health',healthinsurance);

// Investment Account
var investment = require('./insert/accounts/investmentaccount');
app.use('/investment',investment);

// Life Insurance
var lifeinsurance = require('./insert/accounts/lifeinsurance');
app.use('/life',lifeinsurance);

//Motor Insurance
var motorinsurance = require('./insert/accounts/motorinsurance');
app.use('/motor',motorinsurance);

//  Team Insurance
var teaminsurance = require('./insert/accounts/teaminsurance');
app.use('/teaminsurance',teaminsurance);

//Income list of Dashboard
var dashboardIncome = require('../backend/insert/dashboard-card/incomelist');
app.use('/dashboardIncome',dashboardIncome);

// Payment list of Dashboard
var dashboardExpenses = require('../backend/insert/dashboard-card/expenseslist');
app.use('/dashboardExpenses',dashboardExpenses);

//Income Monthwise
var monthwise = require('./insert/monthwise');
app.use('/month',monthwise);

// CreditCard
var creditcard = require('./insert/accounts/creditcard');
app.use('/creditcard',creditcard);

// Savings
var savings=require('./insert/accounts/savings');
app.use('/savings',savings);
// -------------------------------FRIENDS----------------------------------------

//Add Friends
var addFriends = require('../backend/insert/friends/addFriends');
app.use('/addFriends',addFriends);

// View Friends
var viewFriends = require('../backend/insert/friends/viewFriends');
app.use('/viewFriends',viewFriends);

// ---------------------------------------TAG------------------------------------
var tag=require('../backend/insert/tag');
app.use('/tag',tag);

//----------------------------------COMMENT----------------------------------------------
// var comment=require('../backend/insert/comment');
// app.use('/comment',comment);



app.listen(5500);
console.log('Server is running on port 5500');

