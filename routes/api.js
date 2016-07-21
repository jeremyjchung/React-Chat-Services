var express = require('express');
var passwordEncrypter = require('password-hash-and-salt');
var User = require('../models/user');

var router = express.Router();

router.route('/')

  //localhost:/8080/users
  .post(function(req, res) {
    var user = new User();

    passwordEncrypter(req.body.password).hash(function(err, hash) {
      if(err) {
        res.status(503).send(err);
      }
      else {
        user.username = req.body.username;
        user.password = hash;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;

        User.findOne({username: user.username}, function(err, document) {
          if(err) {
            res.status(503).send(err);
          }
          else if(document != null) {
            res.status(400).json({message: 'Username already exists'});
          }
          else{
            user.save(function(err) {
              if(err) {
                res.status(500).send(err);
              }
              else{
                //res.location('http://localhost:9000/users/' + user._id);
                res.status(201).json(user);
              }
            });
          }
        });
      }
    });
  })

  //localhost:8080/users?username={abc}&password={abc}
  .get(function(req, res) {
    var user = User();
    user.username = req.query.username;
    user.password = req.query.password;

    User.findOne({username: user.username}, function(err, document) {
      if(err) {
        res.status(503).send(err);
      }
      else if(document == null) {
        res.status(404).json({message: 'Invalid username and password'});
      }
      else{
        passwordEncrypter(user.password).verifyAgainst(document.password, function(err, verified) {
          if(err)
              res.status(503).send(err);
          else if(!verified) {
              res.status(404).json({message: 'Invalid username and password'});
          }
          else {
              res.status(200).json(document);
          }
        });
      }
    });
  });

router.route('/all')

  .get(function(req, res) {
    User.find({}, function(err, document) {
      if(err) {
        res.status(503).send(err);
      }
      else if(document == null || document.length == 0) {
        res.status(404).json({message: 'No users found...'});
      }
      else{
        res.status(200).json(document);
      }
    })
  })

  .delete(function(req, res) {
    User.remove({}, function(err) {
      if(err) {
        res.status(503).send(err);
      }
      else {
        res.status(200).send({message: 'All users successfully deleted'});
      }
    });
  });



module.exports = router;
