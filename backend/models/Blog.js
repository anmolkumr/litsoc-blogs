const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  featured_img: { type: String },
  content: { type: String, required: true },
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogUsers' },
  club_secy_approval: { type: Boolean, default: false },
  blogmaster_approval: { type: Boolean, default: false },
  saved_at: { type: Date, default: Date.now },
  status: { type: String, default: 'unpublished' },
  published_at: { type: Date },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
