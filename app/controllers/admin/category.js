var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    pinyin = require('pinyin'),
    slug = require('slug'),
    auth = require('./user'),
    Category = mongoose.model('Category');

module.exports = function (app) {
    app.use('/admin/categories', router);//路由的挂载点
};

router.get('/', auth.requireLogin, function (req, res, next) {
    res.render('admin/category/index', {
        pretty: true
    });
});

router.get('/add', auth.requireLogin, function (req, res, next) {
    res.render('admin/category/add', {
        action: "/admin/categories/add",
        pretty: true,
        category: {_id: ''}
    });
});

router.post('/add', auth.requireLogin, function (req, res, next) {
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

router.get('/edit/:id', auth.requireLogin, getCategoryById, function (req, res, next) {
    res.render('admin/category/add', {
        action: "/admin/categories/edit/" + req.category._id,
        category: req.category
    });
});

router.post('/edit/:id', auth.requireLogin, getCategoryById, function (req, res, next) {
    var category = req.category;
    var name = req.body.name.trim();

    var py = pinyin(name, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    }).map(function(item){
        return item[0];
    }).join(' ');

    category.name = name;
    category.slug = slug(py);

    //然后调用post保存
    category.save(function(err, category){
        if(err){
            req.flash('error', '分类编辑失败');
            res.redirect('/admin/categories/edit');
        }else {
            req.flash('info', '分类编辑成功');
            res.redirect('/admin/categories');
        }
    });
});

router.get('/delete/:id', auth.requireLogin, getCategoryById, function (req, res, next) {
    if(!req.params.id){
        return next(new Error('no post id provided'));
    }

    req.category.remove(function(err, rowsRemoved){
        if(err){
            return next(err);
        }

        if(rowsRemoved){
            req.flash('success', '分类删除成功');
        }else{
            req.flash('success', '分类删除失败');
        }

        res.redirect('/admin/categories')
    });
});

function getCategoryById(req, res, next){
    if(!req.params.id){
        return next(new error('no category id provided'));
    }

    Category.findOne({_id: req.params.id})
        .exec(function(err, category){
            if(err){
                return next(err)
            }

            if(!category){
                return next(new Error('category not found', req.params._id))
            }

            req.category = category;
            next();
        });
}
