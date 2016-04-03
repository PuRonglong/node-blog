// category model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  title: {type : string, required : true},
  slug: {type : string, required : true},
  created: {type : Date}
});

mongoose.model('Category', CategorySchema);

