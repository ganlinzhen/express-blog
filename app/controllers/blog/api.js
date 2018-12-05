const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Category = mongoose.model('Category');

// 异步 ajax api

/**
 * 点赞接口
 * */
module.exports = (app) => {
  app.use('/api', router);
};

router.get('/favourite', function(req, res, next){
  let id = req.query.id
  console.log(id)
  if (!id) {
    return next(new Error('no post id provided'))
  }

  Post.findOne({_id: mongoose.Types.ObjectId(id)})
      .populate('category')
      .populate('author')
      .exec((err, post) => {
        if (err) return next(err)
        post.meta.favourite = post.meta.favourite ? post.meta.favourite + 1 : 1
        // 嵌套字段的修改需要手动标记下
        post.markModified('meta');
        post.save(function(err){
          if (err) return next(err)
          res.json({
            code: 200,
            data: post,
            msg: '点赞成功！'
          })
        })
      })
})
