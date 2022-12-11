const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookmarkSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  movieId: Number,
  movieName: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
