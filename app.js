//整个应用的后端的一个服务入口,执行它的话这个服务就会启动

var express = require('express'),
    config = require('./config/config'),
    glob = require('glob'),
    mongoose = require('mongoose');

//连接对应的数据库
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
    require(model);
});

//生成express应用
var app = express();

require('./config/express')(app, config, db);
require('./config/passport').init();

//让这个express应用监听某个端口
app.listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});

