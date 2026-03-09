// MongoDB Setup Script for AnimeVerse
// Run this file to initialize the database

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/animeverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Schemas
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  image: String,
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
});

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  comment: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  replies: [{
    username: String,
    comment: String,
    date: Date,
    likes: Number
  }]
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  avatar: String,
  bio: String
});

// Create Models
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const User = mongoose.model('User', userSchema);

// Create Indexes for better performance
Post.createIndex({ title: 'text', content: 'text' });
Post.createIndex({ category: 1, date: -1 });
Comment.createIndex({ postId: 1, date: -1 });
User.createIndex({ username: 1, email: 1 });

console.log('✅ AnimeVerse MongoDB schemas initialized!');
console.log('📁 Collections: posts, comments, users');
console.log('🔗 Database: animeverse');

module.exports = { Post, Comment, User };