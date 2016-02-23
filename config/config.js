var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'project1'
    },
    port: 3000,
    db: 'mongodb://localhost/project1-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'project1'
    },
    port: 3000,
    db: 'mongodb://localhost/project1-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'project1'
    },
    port: 3000,
    db: 'mongodb://localhost/project1-production'
  }
};

module.exports = config[env];
