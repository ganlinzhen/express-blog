const express = require('express');
const glob = require('glob');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const moment = require('moment')
const truncate = require('truncate')
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const mongoose = require('mongoose')

module.exports = (app, config) => {
  // 设置变量
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  // 设置模板引擎
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');

  // 自定义中间件: 定义全局变量
  app.use(function(req, res, next){
    app.locals.pathName = req.path // 当前页面的路径
    app.locals.moment = moment // 日期格式化
    app.locals.truncate = truncate // 截取文章
    app.locals.categories = [{name: 'js', title: 'java', slug: 'jjj'}]

    var Category = mongoose.model('Category')
    Category.find().sort('-created').exec(function(err, categories){
      if (err) {
        return console.log('category报错')
      }
      app.locals.categories = categories
      next()
    })
  })

  // express 常用中间件
  app.use(favicon(config.root + '/public/img/favicon.ico')); // 网站图标
  app.use(express.static(config.root + '/public'));// 设置静态资源目录： use a reverse proxy cache to improve performance of serving static assets.
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());

  // 执行每个页面的controller函数
  var controllers = glob.sync(config.root + '/app/controllers/**/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  // 404 中间件
  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // if (app.get('env') === 'development') {
  //   app.use((err, req, res, next) => {
  //     res.status(err.status || 500);
  //     res.render('error', {
  //       message: err.message,
  //       error: err,
  //       title: 'error'
  //     });
  //   });
  // }

  // app.use((err, req, res, next) => {
  //   res.status(err.status || 500);
  //   res.render('error', {
  //     message: err.message,
  //     error: {},
  //     title: 'error'
  //   });
  // });

  return app;
};
