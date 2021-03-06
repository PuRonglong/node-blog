var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.redirect('/posts');//默认首页就跳到我们的文章列表
});

router.get('/about', function (req, res, next) {
    res.render('blog/about', {
        title: 'About me',
        pretty: true
    });
});

router.get('/contact', function (req, res, next) {
    res.render('blog/contact', {
        title: 'Contact me',
        pretty: true
    });
});
