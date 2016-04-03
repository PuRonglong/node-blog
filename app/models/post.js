// post model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

//文章表的Schema

var PostSchema = new Schema({
  title: {type : string, required : true},//文章标题
  content: {type : string, required : true},
  slug: {type : string, required : true},//文章的url名称
  category: {type : Schema.Types.ObjectId, required : true},//文章分类
  author: {type : Schema.Types.ObjectId, required : true},
  published: {type : boolean, default : false},
  meta: {type : Schema.Types.Mixed},//收集这个文章被赞或被踩了多少次
  comments: [Schema.Types.Mixed],
  created: {type : Date}
});

mongoose.model('Post', PostSchema);

