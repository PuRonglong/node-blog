//文章列表页

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post');

module.exports = function (app) {
    app.use('/posts', router);
};

router.get('/', function (req, res, next) {
    Post.find({published: true})
        .populate('authoer')
        .populate('category')
        .exec(function (err, posts) {
            if (err) return next(err);
            res.render('blog/index', {//渲染的应是blog下面的index
                posts: posts,
                pretty: true
            });
    });
});

router.get('/view', function (req, res, next) {

});

router.get('/comment', function (req, res, next) {

});

router.get('/favorite', function (req, res, next) {

});
