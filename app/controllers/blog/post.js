//文章列表页

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
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

    var conditions = {};

    try {
        conditions._id = mongoose.Types.ObjectId(req.params.id);
    }catch (err){
        conditions.slug = req.params.id;
    }

    Post.findOne(conditions)
        .populate('category')
        .populate('authoer')
        .exec(function(err, post){
            if(err){return next(err)}

            res.render('blog/view', {
                post: post
            })
        })
});

router.get('/favorite/:id', function (req, res, next) {
    if(!req.params.id){
        return next(new error('no post id provided'));
    }

    var conditions = {};

    try {
        conditions._id = mongoose.Types.ObjectId(req.params.id);
    }catch (err){
        conditions.slug = req.params.id;
    }

    Post.findOne(conditions)
        .populate('category')
        .populate('authoer')
        .exec(function(err, post){
            if(err){return next(err)}

            post.meta.favorite = post.meta.favorite ? post.meta.favorite + 1 : 1;
            post.markModified('meta');
            post.save(function(err){
                res.redirect('/posts/view/' + post.slug);
            })
        })
});

router.post('/comment/:id', function (req, res, next) {
    if(!req.body.email){
        return next(new error('no email provided for comments'));
    }

    if(!req.body.content){
        return next(new error('no content provided for comments'));
    }

    var conditions = {};

    try {
        conditions._id = mongoose.Types.ObjectId(req.params.id);
    }catch (err){
        conditions.slug = req.params.id;
    }

    Post.findOne(conditions).exec(function(err, post){
        if(err){return next(err)}

        var comment = {
            email: req.body.email,
            content: req.body.content,
            created: new Date()
        };

        post.comments.unshift(comment);
        post.markModified("comments");
        post.save(function(err, post){
            req.flash('info', '评论添加成功');
            res.redirect('/posts/view/' + post.slug)
        })
    })
});

