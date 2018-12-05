const express = require('express');
const config = require('./config/config');
const glob = require('glob');
const mongoose = require('mongoose');
const initExpress = require('./config/express')

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

// express 应用
const app = express();
initExpress(app, config); // 原来代码 module.exports=require('./config/express')(app,config)

app.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});
