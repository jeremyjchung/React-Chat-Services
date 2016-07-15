var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.route('/')
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
            res.status(200).json(user);
          }
        });
      }
    });
  });

module.exports = router;
