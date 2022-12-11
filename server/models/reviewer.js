const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewerSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  commentsReviewed: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('Reviewer', ReviewerSchema);
