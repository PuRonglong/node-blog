var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    slug = require('slug'),
    Category = mongoose.model('Category');

module.exports = function (app) {
    app.use('/admin/posts', router);//路由的挂载点
};

router.get('/', function (req, res, next) {

    //sort
    var sortby = req.query.sortby ? req.query.sortby : 'created';
    var sortdir = req.query.sortdir ? req.query.sortdir : 'desc';

    if(['title', 'category', 'author', 'created', 'published'].indexOf(sortby) === -1){
        sortby = 'created';
    }

    //排序方向,升和降
    if(['desc', 'asc'].indexOf(sortdir) === -1){
        sortdir = 'desc';//默认降序
    }

    //排序对象
    var sortObj = {};
    sortObj[sortby] = sortdir;

    //condition
    var conditions = {};
    if(req.query.category){
        conditions.category = req.query.category.trim();
    }

    if(req.query.author){
        conditions.author = req.query.author.trim();
    }

    User.find({}, function(err, authors){
        if (err) return next(err);

        Post.find(conditions)
            .sort(sortObj)
            .populate('author')
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
                    authors: authors,
                    sortdir: sortdir,
                    sortby: sortby,
                    pretty: true,
                    filter: {
                        category: req.query.category || "",
                        author: req.query.author || "",
                    }
                });
            });
    });

});

router.get('/add', function (req, res, next) {
    res.render('admin/post/add', {
        pretty: true
    });
});

router.post('/add', function (req, res, next) {
    //把提交的参数初始化
    var title = req.body.title.trim();
    var category = req.body.category.trim();
    var content = req.body.content;

    User.findOne({}, function(err, author){
        if(err){
            return next(err);
        }

        var post = new Post({
            title: title,
            slug: slug(title),
            category: category,
            content: content,
            author: author,
            published: true,
            meta: {favorite: 0},
            comments: [],
            created: new Date()
        });

        post.save(function(err, post){
            if(err){
                req.flash('error', '文章保存失败');
                res.redirect('/admin/posts/add');
            }else {
                req.flash('info', '文章保存成功');
                res.redirect('/admin/posts');
            }
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
