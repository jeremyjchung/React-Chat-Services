var bodyParser = require('body-parser');
var express = require('express');
var routes = require('./routes/api');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
    res.send('Welcome to React Chat Services!!!');
});

//app.use();

app.listen(9000);
console.log('React Chat Services fired up!!! Listening on port 9000 ....');
