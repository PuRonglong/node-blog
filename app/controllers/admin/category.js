var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    pinyin = require('pinyin'),
    slug = require('slug'),
    Category = mongoose.model('Category');

module.exports = function (app) {
    app.use('/admin/categories', router);//路由的挂载点
};

router.get('/', function (req, res, next) {
    res.render('admin/category/index', {
        pretty: true
    });
});

router.get('/add', function (req, res, next) {
    res.render('admin/category/add', {
        action: "/admin/categories/add",
        pretty: true,
        category: {_id: ''}
    });
});

router.post('/add', function (req, res, next) {
    //进行校验
    req.checkBody('name', '分类标题不能为空').notEmpty();

    //获取后端验证的错误,若有错则重新渲染
    var errors = req.validationErrors();
    if(errors){
        return res.render('admin/category/add', {
            errors: errors,
            content: req.body.content
        });
    }

    //把提交的参数初始化,对数据做清洗
    var name = req.body.name.trim();

    var py = pinyin(name, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    }).map(function(item){
        return item[0];
    }).join(' ');

    var category = new Category({
        name: name,
        slug: slug(py),
        created: new Date()
    });

    category.save(function(err, category){
            if(err){
                req.flash('error', '分类保存失败');
                res.redirect('/admin/categories/add');
            }else {
                req.flash('info', '分类保存成功');
                res.redirect('/admin/categories');
            }
        });
});

router.get('/edit/:id', function (req, res, next) {});

router.post('/edit/:id', function (req, res, next) {});

router.get('/delete/:id', function (req, res, next) {

});
