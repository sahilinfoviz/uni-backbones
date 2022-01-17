var con = require('../db_connection');
var connection = con.getConnection();
connection.connect();
var express = require('express');

var router = express.Router();


router.post('/',(req,res) => {
  var uuser_id=req.body.uuser_id;
  var username = req.body.username;
  var email = req.body.email;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var address = req.body.address;
  var city = req.body.city;
  var country = req.body.country;
  var postalcode=req.body.postalcode;
  var position=req.body.position;
  var organization=req.body.organization;
  var gender= req.body.gender;
  var dob = req.body.dob;
  var phone_no = req.body.phone_no;
  connection.query("insert into user values(null,'"+username+"','"+email+"','"+fname+"','"+lname+"','"+address+"','"+city+"','"+country+"','"+postalcode+"','"+position+"','"+organization+"','"+gender+"','"+dob+"','"+phone_no+"')",(err,result)=>{
    if(err) {
      res.send({"insert":"fail"});
      console.log(err);
    }
    else {
      res.send({"insert":"Suceess"});
    }
  });
});




module.exports=router;
