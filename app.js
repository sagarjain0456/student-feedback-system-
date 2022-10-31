const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


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




app.listen(process.env.PORT || 4000, function() {
console.log("Server started on port 4000");
});
