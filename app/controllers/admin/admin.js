const express = require('express');
const router = express.Router();

module.exports = (app) => {
  app.use('/admin', router);
};

router.get('/', (req, res, next) => {
    console.log('渲染admin页面')
    res.render('admin/index', {
      title: 'Generator-Express MVC'
    });
});
