const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { authCheck, userCheck, reviewerCheck } = require('../middlewares/auth');

const Comment = mongoose.model('Comment');
const router = new express.Router();

router.delete('/:id', reviewerCheck, async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

router.get('/', reviewerCheck, async (req, res) => {
  let r = await Comment.find({}).populate('user');
  res.json(r);
});

router.post('/:id/comment', userCheck, async (req, res) => {
  let c = new Comment({
    ...req.body,
    user: req.session.user,
  });
  await c.save();
  res.json(c);
});

router.get('/:id/comments', async (req, res) => {
  let r = await Comment.find({ movieId: Number(req.params.id) }).populate('user');
  res.json(r);
});

module.exports = router;