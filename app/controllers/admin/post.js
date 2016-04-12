var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category');

module.exports = function (app) {
    app.use('/admin/posts', router);//路由的挂载点
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

            res.render('admin/post/index', {
                posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),//按照每一页进行划分
                pageNum: pageNum,
                pageCount: pageCount,
                pretty: true
            });
        });
});

router.get('/edit/:id', function (req, res, next) {});

router.post('/edit/:id', function (req, res, next) {});

router.get('/delete/:id', function (req, res, next) {});
