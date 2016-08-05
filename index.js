var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var userRoutes = require('./routes/userApi');
var chatroomRoutes = require('./routes/chatApi');
var chatServices = require('./services/chatServices');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ReactChatUsers');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
    res.send('Welcome to the React Chat Services!!!');
});

app.use('/users', userRoutes);
app.use('/chatrooms', chatroomRoutes);

chatServices(io);

http.listen(4112, function() {
  console.log('React Chat socket fired up!!! Listening on port 4112 ....');
});
app.listen(9000, function() {
  console.log('React Chat Services fired up!!! Listening on port 9000 ....');
});
