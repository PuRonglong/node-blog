var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'node-blog'
    },
    port: 3000,
    db: 'mongodb://localhost/nodeblog'//修改数据库为我们创建的数据库
  },

  test: {
    root: rootPath,
    app: {
      name: 'node-blog'
    },
    port: 3000,
    db: 'mongodb://localhost/node-blog-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'node-blog'
    },
    port: 3000,
    db: 'mongodb://localhost/node-blog-production'
  }
};

module.exports = config[env];
