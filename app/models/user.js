// user model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type : string, required : true},
  email: {type : string, required : true},
  password: {type : string, required : true},
  created: {type : Date}
});

mongoose.model('User', UserSchema);

