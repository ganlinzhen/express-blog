const express = require('express');
const router = express.Router();

module.exports = (app) => {
  app.use('/', router);
};

// 将文章相关的内容单独拆成一组路由
router.get('/', (req, res, next) => {
  res.redirect('/posts')
});

// 关于页面
router.get('/about', (req, res, next) => {
  res.render('blog/about', {
    title: '关于我',
    pretty: true
  })
})

// 联系我页面
router.get('/contact', (req, res, next) => {
  res.render('blog/contact', {
    title: '联系我',
    pretty: true
  })
})


