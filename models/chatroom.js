var restful = require('node-restful');
var UserSchema = require('./user').schema;
var mongoose = restful.mongoose;

var ProductSchema = mongoose.Schema({
  users: [UserSchema],
  messages: [{firstname: String, message: String}]
});

module.exports = restful.model('ChatRoom', ProductSchema);
