var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category');

module.exports = function (app) {
    app.use('/admin/posts', router);//路由的挂载点
};

router.get('/', function (req, res, next) {
    var sortby = req.query.sortby ? req.query.sortby : 'title';
    var sortdir = req.query.sortdir ? req.query.sortdir : 'desc';

    if(['title', 'category', 'authoer', 'created', 'published'].indexOf(sortby) === -1){
        sortby = 'created';
    }

    //排序方向,升和降
    if(['desc', 'asc'].indexOf(sortdir) === -1){
        sortdir = 'desc';//默认降序
    }

    //排序对象
    var sortObj = {};
    sortObj[sortby] = sortdir;

    Post.find({published: true})
        .sort(sortObj)
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
                sortdir: sortdir,
                sortby: sortby,
                pretty: true
            });
        });
});

router.get('/edit/:id', function (req, res, next) {});

router.post('/edit/:id', function (req, res, next) {});

router.get('/delete/:id', function (req, res, next) {
    if(!req.params.id){
        return next(new Error('no post id provided'));
    }

    Post.remove({_id: req.params.id}).exec(function(err, rowsRemoved){
        if(err){
            return next(err);
        }

        if(rowsRemoved){
            req.flash('success', '文章删除成功');
        }else{
            req.flash('success', '文章删除失败');
        }

        res.redirect('/admin/posts')
    })
});
