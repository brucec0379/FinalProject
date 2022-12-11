const mongoose = require('mongoose');

module.exports.authCheck = function (req, res, next) {
  if (!req.session.user) {
    res.sendStatus(401);
  } else {
    next();
  }
};

module.exports.userCheck = function (req, res, next) {
  if (req.session.role !== 'user') {
    res.sendStatus(401);
  } else {
    next();
  }
};

module.exports.reviewerCheck = function (req, res, next) {
  if (req.session.role !== 'reviewer' && req.session.role !== 'admin') {
    res.sendStatus(401);
  } else {
    next();
  }
};

module.exports.adminCheck = function (req, res, next) {
  if (req.session.role !== 'admin') {
    res.sendStatus(401);
  } else {
    next();
  }
};

