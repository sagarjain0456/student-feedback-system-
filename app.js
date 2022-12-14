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
app.use(bodyParser.urlencoded({extended: true}));

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


const remarksGradeSchema = new mongoose.Schema ({
remarks:String,
grade: String
});



const secret =process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("student-feedback-portal-collection", userSchema);

const remarksGrade = new mongoose.model("remark-grade-collection", remarksGradeSchema);

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
      res.sendFile( __dirname + "/login.html");
    }

  });
 })
 // End of handling of the post request for signup.html route



// Starting of the Handling of post request for aftersignup.html route
 app.post("/aftersignup.html", function(req,res){
    console.log(req.body.remarksrollone);
    console.log(req.body.graderollone);

  const newremarksGrade = new remarksGrade({
    remarksRoll1: req.body.remarksrollone,
    gradeRoll1: req.body.remarksrollone
  });

  newremarksGrade.save(function(err){
     if(err){
       console.log(err);
     }

     else{
       res.sendFile( __dirname + "/remarkgradeupdated.html");
     }

   });
  })


 app.post("/login.html", function(req,res){
 const username = req.body.email;
 const password = req.body.password;
 const teachercode = req.body.teachercode;
 //User is the name of the collection
 User.findOne({email: username}, function(err, foundUser){
   if(err){
     console.log(err);
   }

   else{
     if(foundUser){
       if(foundUser.password === password & teachercode ===process.env.TEACHERCODE){
         res.sendFile(__dirname + "/aftersignup.html");
       }
     }
   }

 });

 });



app.listen(4000, function() {
console.log("Server started on port 4000");
});
