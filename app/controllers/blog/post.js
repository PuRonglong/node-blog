//文章列表页

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post');
    Category = mongoose.model('Category');

module.exports = function (app) {
    app.use('/posts', router);
};

router.get('/', function (req, res, next) {
    Post.find({published: true})
        .sort('created')
        .populate('authoer')
        .populate('category')
        .exec(function (err, posts) {
            if (err) return next(err);

            var pageNum = Math.abs(parseInt(req.query.page || 1, 10));//页数,让pageNum变成正整数
            var pageSize = 10;//一页展示十条
            var totalCount = posts.length;//得到文章总数
            var pageCount = Math.ceil(totalCount / pageSize);//文章页数 = 文章总数 / 每页文章数

            //如果当前页数大于总页数,把最后一页设为当前页数
            if(pageNum > pageCount){
                pageNum = pageCount;
            }

            res.render('blog/index', {
                posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),//按照每一页进行划分
                pageNum: pageNum,
                pageCount: pageCount,
                pretty: true
            });
    });
});

router.get('/category/:name', function (req, res, next) {
    Category.findOne({name: req.params.name}).exec(function(err, category){
        if (err) return next(err);

        Post.find({category: category, published: true})
            .sort('created')
            .populate('authoer')
            .populate('category')
            .exec(function(err, posts){
                if (err) return next(err);

                res.render('blog/category', {
                    posts: posts,
                    category: category,
                    pretty: true
                });
            })
    });
});

router.get('/view/:id', function (req, res, next) {
    if(!req.params.id){
        return next(new error('no post id provided'));
    }

    Post.findOne({_id: req.params.id})
        .populate('category')
        .populate('authoer')
        .exec(function(err, post){
            if(err){return next(err)}

            res.render('blog/view', {
                post: post
            })
        })
});

router.get('/comment', function (req, res, next) {

});

router.get('/favorite', function (req, res, next) {

});
