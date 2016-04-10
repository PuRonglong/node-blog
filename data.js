//随机插入大量文章数据的脚本

var loremipsum = require('lorem-ipsum'),
    slug = require('slug'),
    config = require('./config/config'),
    glob = require('glob'),
    mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
    require(model);
});

//把所有的model文件加载进来
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var Category = mongoose.model('Category');

//不会生成很多用户和分类
User.findOne(function(err, user){
    if(err){
        return console.log('cannot find user');
    }

    Category.find(function(err, categories){
        if(err){
            return console.log('cannot find categories');
        }

        //每一个分类下面随机地生成文章
        categories.forEach(function(category){

            //使用循环让每一个分类插入35个文档
            for(var i = 0; i < 35; i++){
                //标题随机生成一句话
                var title = loremipsum({count: 1, units: 'sentence'});

                var post = new Post({
                    title: title,
                    content: loremipsum({count: 30, units: 'sentence'}),
                    slug: slug(title),
                    category: category,
                    authoer: user,
                    published: true,
                    meta: {favorites: 0},
                    comments: [ ],
                    created: new Date
                });

                //保存新建的post
                post.save(function(err, post){
                    console.log('saved post: ', post.slug);
                });
            }
        })
    })
});
