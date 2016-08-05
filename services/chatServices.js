var express = require('express');
var ChatRoom = require('../models/chatroom');

function chatServices(io) {
  io.on('connection', function(socket) {
    console.log('connection made ...');

    socket.on('join-room', function(room, name) {
      socket.name = name;
      socket.room = room;
      socket.join(socket.room);
      console.log(socket.room + ': ' + socket.name + ' has joined.');
    });

    socket.on('message', function(message) {
      socket.broadcast.to(socket.room).emit('receive-message', message, socket.name);
      ChatRoom.findById(socket.room, function(err, document) {
        if(err) {
          console.log('Server may be down...\n' + err);
        }
        else if(document == null) {
          console.log('Chatroom ' + socket.room + ' does not exist');
        }
        else {
          document.messages.push({firstname: socket.name, message: message});
          if(document.messages.length > 50) {
            document.messages.shift();
          }
          document.save(function(error) {
            if(error) {
              console.log('Message failed to push to database...');
            }
            else {
              console.log(socket.name + ' just sent a message!');
            }
          });
        }
      });
    });

    socket.on('leave-room', function() {
      socket.leave(socket.room);
      console.log(socket.room + ': ' + socket.name + ' has left.');
    });
  });
}

module.exports = chatServices;
