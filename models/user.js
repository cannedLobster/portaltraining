var mongoose = require('mongoose');
var passwordHash = require('password-hash');

var schema = new mongoose.Schema({
  name: String,
  user: String,
  email: String,
  pass: String
});
//OVERRIDE TO REMOVE PASSWORD FROM RETURNED json
schema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.pass;
  return obj;
};
schema.statics.removePass = function(user) {
  var obj = user.toObject();
  delete obj.pass;
  return obj;
}
schema.statics.hashPassword = function(password) {
  var temp = passwordHash.generate(password);
  console.log(temp);
  return temp;
}
//shema.statics.hashPassword add pass automatically in obj UserModel.hashPassword(body.pass),


module.exports = mongoose.model('user', schema);
