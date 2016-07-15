var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.route('/')

  //localhost:/8080/users 
  .post(function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
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
  })

  //localhost:8080/users?username={abc}&password={abc}
  .get(function(req, res) {
    var user = User();
    user.username = req.query.username;
    user.password = req.query.password;

    User.findOne({username: user.username, password: user.password}, function(err, document) {
      if(err) {
        res.status(503).send(err);
      }
      else if(document == null) {
        res.status(404).json({message: 'Invalid username and password pair'});
      }
      else{
        res.status(200).json(document);
      }
    });
  });

module.exports = router;
