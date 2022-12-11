const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Reviewer = mongoose.model('Reviewer');
const Admin = mongoose.model('Admin');
const router = new express.Router();

const UserModel = {
  user: User,
  reviewer: Reviewer,
  admin: Admin
};

router.post('/register', async (req, res) => {
  const Model = UserModel[req.body.role];
  let existed = await Model.findOne({ email: req.body.email });
  if (existed) {
    res.json({
      error: 'Email existed'
    });
  } else {
    let psw = bcrypt.hashSync(req.body.password, 10);
    let user = new Model({
      ...req.body,
      password: psw
    });
    await user.save();
    req.session.user = user._id;
    req.session.role = req.body.role;
    res.json({ user, role: req.session.role });
  }
});

router.post('/login', async (req, res) => {
  const Model = UserModel[req.body.role];
  const user = await Model.findOne({ email: req.body.email });
  if (!user) {
    res.status(401).send({ error: 'Email not existed or password incorrect.' });
  } else if (user.banned) {
    res.status(403).send({ error: 'You are not allowed to login, please contact website admin.' });
  } else {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user = user._id;
      req.session.role = req.body.role;
      res.json({ user, role: req.session.role });
    } else {
      res.status(401).send('Email not existed or password incorrect.');
    }
  }
});

router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.role = null;
  res.sendStatus(200);
});

router.get('/current', async (req, res) => {
  if (req.session.role && req.session.user) {
    const Model = UserModel[req.session.role];
    res.json({
      user: await Model.findById(req.session.user),
      role: req.session.role
    });
  } else {
    res.json(null);
  }
});

module.exports = router;