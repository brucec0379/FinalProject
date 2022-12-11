const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  movieId: Number,
  movieName: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
