const loremipsum = require('lorem-ipsum')
const slug = require('slug')
const glob = require('glob');
const config = require('./config/config');
const mongoose = require('mongoose');

// mongo 数据库
mongoose.connect(config.db, { useMongoClient: true });
const db = mongoose.connection;
db.on('connected', () => {
  console.log('mongodb数据库连接成功！')
});
db.on('error', () => {
  throw new Error('unable to connect to database at ' + config.db);
});

// 引入数据模型 model
const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

const Post = mongoose.model('Post')
const Category = mongoose.model('Category')
const User = mongoose.model('User')

User.findOne(function(err, user) {
  if (err) {
    return console.log('cannot find user');
  }

  Category.find(function (err, categories) {
		if (err) {
			return console.log('cannot find categories');
		}

		categories.forEach(function (category) {
			for (var i = 0; i < 35; i++) {
				var title = loremipsum({ count: 1, units: 'sentence' });
				var post = new Post({
					title: title,
					slug: slug(title),
					content: loremipsum({ count: 30, units: 'sentence' }),
				    category: category,
				    author: user,
				    published: true,
				    meta: { favorites: 0},
				    comments: [ ],
				    created: new Date
				});

				post.save(function (err, post) {
					console.log('saved post: ', post.slug);
				});
			}
		});
	});
})
