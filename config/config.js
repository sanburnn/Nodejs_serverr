const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'resik'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/resik-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'resik'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/resik-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'resik'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/resik-production'
  }
};

module.exports = config[env];
