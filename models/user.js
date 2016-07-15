var restful = require('node-restful');
var mongoose = restful.mongoose;

var ProductSchema = mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String
});

module.exports = restful.model('User', ProductSchema);
