const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Category = mongoose.model('Category');

// 将文章相关的内容单独拆成一组路由
module.exports = (app) => {
  app.use('/posts', router);
};

// 全部文章的列表
router.get('/', (req, res, next) => {
  var conditons = { published: true }
  Post.find(conditons)
      .sort('-created')
      .populate('author')
      .populate('category')
      .exec(function(err, posts){
        // return res.json(posts) // 测试代码
        if (err) return next(err)

        var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
        var pageSize = 10;

        var totalCount = posts.length;
        var pageCount = Math.ceil(totalCount / pageSize);

        if (pageNum > pageCount) {
            pageNum = pageCount;
        }
        res.render('blog/index', {
          posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
          pageCount: pageCount,
          pageNum: pageNum,
          pretty: true
        })
      })
});

// 根据标签分类的列表
router.get('/category/:name', (req, res, next) => {
  Category.findOne({name: req.params.name}).exec(function(err, category){
    if (err) return next(err)

    Post.find({ category: category, published: true })
        .sort('-created')
        .populate('category')
        .populate('author')
        .exec(function(err, posts){
          if (err) {
            return next(err)
          }

          var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
          var pageSize = 10;

          var totalCount = posts.length;
          var pageCount = Math.ceil(totalCount / pageSize);

          if (pageNum > pageCount) {
              pageNum = pageCount;
          }
          res.render('blog/index', {
            posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
            pageCount: pageCount,
            pageNum: pageNum,
            pretty: true
          })
        })
  })
})

// 文章的详情
router.get('/view/:id', (req, res, next) => {
  if (!req.params.id) {
    return next(new Error('no post id provided'));
  }

  var conditions = {};
  try {
      conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
      // 如果没传id，兼容 slug 查询
      conditions.slug = req.params.id;
  }
  Post.findOne(conditions)
      .populate('category')
      .populate('author')
      .exec(function(err, post){
        if (err) return next(err)
        res.render('blog/view', {
          post: post
        })
      })
})

// 文章点赞接口
router.get('/favourite/:id', (req, res, next)=>{
  if (!req.params.id) {
    return next(new Error('no post id provided'))
  }

  Post.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
      .populate('category')
      .populate('author')
      .exec((err, post) => {
        if (err) return next(err)
        post.meta.favourite = post.meta.favourite ? post.meta.favourite + 1 : 1
        // 嵌套字段的修改需要手动标记下
        post.markModified('meta');
        post.save(function(err){
          if (err) return next(err)
          res.redirect('/posts/view/' + post._id)
        })
      })
})
