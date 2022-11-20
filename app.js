require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db =process.env.DATABASE;
const request = require("request");
const encrypt = require("mongoose-encryption");

mongoose.connect(db);
// console.log(process.env);
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/signup.html", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/login.html", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});


const userSchema = new mongoose.Schema ({
firstname:String,
lastname: String,
email: String,
password: String
});


const secret =process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("student-feedback-portal-collection", userSchema);



// Starting of the Handling of post request for signup.html route

app.post("/signup.html", function(req,res){
 const newUser = new User({
   email: req.body.email,
   password: req.body.password,
   firstname: req.body.firstname,
   lastname: req.body.lastname
 });



 newUser.save(function(err){
    if(err){
      console.log(err);
    }

    else{
      res.sendFile( __dirname + "/aftersignup.html");
    }

  });
 })
 // End of handling of the post request for signup.html route



 app.post("/login.html", function(req,res){
 const username = req.body.email;
 const password = req.body.password;
 //User is the name of the collection
 User.findOne({email: username}, function(err, foundUser){
   if(err){
     console.log(err);
   }

   else{
     if(foundUser){
       if(foundUser.password === password){
         res.sendFile(__dirname + "/aftersignup.html");
       }
     }
   }

 });

 });



app.listen(4000, function() {
console.log("Server started on port 4000");
});
