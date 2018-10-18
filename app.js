"use strict"

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

//changing name checking
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/',routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

app.listen(process.env.PORT||8080,()=> {
  console.log("starting to listen");
})
