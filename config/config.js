const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'simpleblog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:27017/blog'
  },

  test: {
    root: rootPath,
    app: {
      name: 'simpleblog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://blog:blog@localhost/simpleblog-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'simpleblog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/simpleblog-production'
  }
};

module.exports = config[env];
