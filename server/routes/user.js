const express = require('express');
const mongoose = require('mongoose');
const { userCheck, adminCheck } = require('../middlewares/auth');

const Comment = mongoose.model('Comment');
const Bookmark = mongoose.model('Bookmark');
const User = mongoose.model('User');
const Follow = mongoose.model('Follow');
const router = new express.Router();

router.get('/', async (req, res) => {
  res.json(await User.find({}));
});

router.get('/:id', async (req, res) => {
  res.json({
    profile: await User.findById(req.params.id, '-password -email'),
    comments: await Comment.find({ user: req.params.id }),
    bookmarks: await Bookmark.find({ user: req.params.id }),
    followers: await Follow.find({ to: req.params.id }).populate('from to'),
    following: await Follow.find({ from: req.params.id }).populate('from to')
  });
});

router.put('/:id/follow',userCheck, async (req, res) => {
  await (new Follow({
    from: req.session.user,
    to: req.params.id
  })).save();
  res.sendStatus(200);
});

router.put('/:id/unfollow',userCheck, async (req, res) => {
  await Follow.remove({
    from: req.session.user,
    to: req.params.id
  });
  res.sendStatus(200);
});

router.put('/:id/ban',adminCheck, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { banned: true });
  res.sendStatus(200);
});

router.put('/:id/unban',adminCheck, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { banned: false });
  res.sendStatus(200);
});

module.exports = router;