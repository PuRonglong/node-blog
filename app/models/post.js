// post model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//文章表的Schema

var PostSchema = new Schema({
    title: {type : String, required : true},//文章标题
    content: {type : String, required : true},
    slug: {type : String, required : true},//文章的url名称
    category: {type : Schema.Types.ObjectId, ref : 'Category'},//文章分类
    author: {type : Schema.Types.ObjectId, ref : 'User'},
    published: {type : Boolean, default : false},
    meta: {type : Schema.Types.Mixed},//收集这个文章被赞或被踩了多少次
    comments: [Schema.Types.Mixed],
    created: {type : Date}
});

mongoose.model('Post', PostSchema);

