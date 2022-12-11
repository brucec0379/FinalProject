const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { authCheck, userCheck } = require('../middlewares/auth');

const Comment = mongoose.model('Comment');
const Bookmark = mongoose.model('Bookmark');
const router = new express.Router();

let tmdb_key = 'b29e40cbe0ec7a3a4f8a44d21be69c7d';
let tmdb_base = 'https://api.themoviedb.org/3';

router.post('/:id/comment', userCheck, async (req, res) => {
  let c = new Comment({
    ...req.body,
    user: req.session.user,
  });
  await c.save();
  res.json(c);
});

router.get('/:id/bookmark', userCheck, async (req, res) => {
  let c = await Bookmark.findOne({
    user: req.session.user,
    movieId: Number(req.params.id)
  });
  res.json(c);
});

router.post('/:id/bookmark', userCheck, async (req, res) => {
  let existed = await Bookmark.findOne({
    user: req.session.user,
    movieId: Number(req.params.id)
  });
  if (existed) {
    res.json(existed);
    return;
  }
  let c = new Bookmark({
    movieId: Number(req.params.id),
    movieName: req.body.movieName,
    user: req.session.user,
  });
  await c.save();
  res.json(c);
});

router.delete('/:id/bookmark', userCheck, async (req, res) => {
  await Bookmark.remove({
    user: req.session.user,
    movieId: Number(req.params.id)
  });
  res.sendStatus(200);
});

router.get('/:id/comments', async (req, res) => {
  let r = await Comment.find({ movieId: Number(req.params.id) }).populate('user');
  res.json(r);
});

router.get('/:id', async (req, res) => {
  let r = await axios.get(`${tmdb_base}/movie/${req.params.id}?api_key=${tmdb_key}`, {
    headers: {
      'accept-encoding': 'plain',
    }
  });
  res.json(r.data);
});

router.get('/search/:q', async (req, res) => {
  let r = await axios.get(tmdb_base + `/search/movie?api_key=${tmdb_key}&language=en-US&query=${req.params.q}`, {
    headers: {
      'accept-encoding': 'plain',
    }
  });
  // console.log(r.headers);
  res.json(r.data);
});

module.exports = router;