var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/admin/users', router);
};

router.get('/login', function (req, res, next) {
    res.render('admin/user/login', {
        pretty: true
    });
});

//登陆的提交
router.post('/login', function (req, res, next) {
    res.jsonp(req.body);
    res.render('admin/user/login', {
        pretty: true
    });
});

router.get('/register', function (req, res, next) {
    res.render('admin/user/register', {
        pretty: true
    });
});

router.post('/register', function (req, res, next) {
    res.jsonp(req.body);
    res.render('admin/user/login', {
        pretty: true
    });
});

router.get('/layout', function (req, res, next) {
    res.redirect('/');
});
