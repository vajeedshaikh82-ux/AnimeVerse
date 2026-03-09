// Insert sample posts
Post.insertMany([
  { title: "Top 10 Shonen of 2024", content: "...", author: "AnimeReviewer", category: "Reviews" },
  { title: "Studio Ghibli's Hidden Gems", content: "...", author: "GhibliFan", category: "Reviews" }
]);

// Find all published posts
Post.find({ status: 'published' }).sort({ date: -1 });

// Search posts by text
Post.find({ $text: { $search: "shonen" } });

// Get comments for a post
Comment.find({ postId: ObjectId("...") }).sort({ date: -1 });

// Count total posts
Post.countDocuments({ status: 'published' });