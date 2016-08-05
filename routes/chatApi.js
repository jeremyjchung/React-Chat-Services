var express = require('express');
var User = require('../models/user');
var ChatRoom = require('../models/chatroom');

var router = express.Router();

router.route('/')

  //localhost:/8080/chatrooms
  .post(function(req, res) {
    var chatroom = new ChatRoom();
    chatroom.messages = [];
    chatroom.users = [];
    var users = JSON.parse(JSON.stringify(req.body.users));

    chatroom.users = users.map(function(user) {
      var chatUser = new User();
      chatUser.username = user.username;
      chatUser.password = user.password;
      chatUser.firstname = user.firstname;
      chatUser.lastname = user.lastname;
      return chatUser;
    });

    chatroom.save(function(err) {
      if(err) {
        console.log(err);
        res.status(500).send(err);
      }
      else{
        res.status(201).json(chatroom);
      }
    });
  })

  //localhost:/8080/chatrooms?username1={abc}&username2={abc}
  .get(function(req, res) {
    var username1 = req.query.username1;
    var username2 = req.query.username2;

    ChatRoom.find({$and: [{'users.username': username1}, {'users.username': username2}]}, function(err, document) {
      if(err) {
        res.status(503).send(err);
      }
      else if(document == null) {
        res.status(404).json({message: 'Chatroom does not exist'});
      }
      else {
        res.status(200).json(document);
      }
    });
  });

router.route('/all')

  .get(function(req, res) {
    ChatRoom.find({}, function(err, document) {
      if(err) {
        res.status(503).send(err);
      }
      else if(document == null || document.length == 0) {
        res.status(404).json({message: 'No rooms found...'});
      }
      else{
        res.status(200).json(document);
      }
    });
  })

  .delete(function(req, res) {
    ChatRoom.remove({}, function(err) {
      if(err) {
        res.status(503).send(err);
      }
      else {
        res.status(200).send({message: 'All chatrooms successfully deleted'});
      }
    });
  });

router.get('/:roomId', function(req, res) {
  ChatRoom.findById(req.params.roomId, function(err, document) {
    if(err) {
      res.status(503).send(err);
    }
    else if(document == null) {
      res.status(404).json({message: 'Chatroom does not exist'});
    }
    else {
      res.status(200).json(document);
    }
  });
});

module.exports = router;
