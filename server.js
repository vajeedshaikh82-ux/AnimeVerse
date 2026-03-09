// AnimeVerse - Backend Server
// Node.js + Express API for Anime Blog

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = 3000;

// ============================================
// Middleware Configuration
// ============================================

// Enable CORS for all origins (can be restricted in production)
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for frontend)
app.use(express.static('public'));

// ============================================
// Sample Anime Blog Posts Data
// ============================================

const posts = [
    {
        id: 1,
        title: "Top 10 Shonen of 2024",
        author: "AnimeReviewer",
        date: "2024-01-15",
        category: "Reviews",
        content: "From battle shonen to psychological thrillers, we break down the best action anime released this year.",
        image: "https://via.placeholder.com/400x200/ff9a9e/ffffff?text=Shonen+2024",
        likes: 245,
        comments: 32
    },
    {
        id: 2,
        title: "Studio Ghibli's Hidden Gems",
        author: "GhibliFan",
        date: "2024-01-12",
        category: "Reviews",
        content: "Looking beyond Spirited Away? Discover the underrated masterpieces from the legendary studio.",
        image: "https://via.placeholder.com/400x200/a1c4fd/ffffff?text=Ghibli+Gems",
        likes: 189,
        comments: 28
    },
    {
        id: 3,
        title: "Season 2 Announcements",
        author: "NewsBot",
        date: "2024-01-10",
        category: "News",
        content: "The biggest news of the week: Which of your favorite shows are returning for a second season?",
        image: "https://via.placeholder.com/400x200/cfd9df/333333?text=Season+2",
        likes: 312,
        comments: 45
    },
    {
        id: 4,
        title: "Best Anime Openings of All Time",
        author: "MusicLover",
        date: "2024-01-08",
        category: "Top Lists",
        content: "From classic hits to modern masterpieces, we rank the most iconic anime opening themes ever created.",
        image: "https://via.placeholder.com/400x200/7000ff/ffffff?text=Openings",
        likes: 421,
        comments: 67
    },
    {
        id: 5,
        title: "Manga vs Anime: What's Better?",
        author: "DebateKing",
        date: "2024-01-05",
        category: "Discussion",
        content: "A deep dive into the differences between manga and anime adaptations and which medium wins.",
        image: "https://via.placeholder.com/400x200/ff6b6b/ffffff?text=Manga+vs+Anime",
        likes: 156,
        comments: 89
    }
];

// ============================================
// API Endpoints
// ============================================

// GET /posts - Get all posts
app.get('/posts', (req, res) => {
    try {
        // Support filtering by category
        const category = req.query.category;
        
        let filteredPosts = posts;
        
        if (category) {
            filteredPosts = posts.filter(post => 
                post.category.toLowerCase() === category.toLowerCase()
            );
        }
        
        // Support pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            data: paginatedPosts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filteredPosts.length / limit),
                totalPosts: filteredPosts.length,
                limit: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching posts',
            error: error.message
        });
    }
});

// GET /posts/:id - Get a single post by ID
app.get('/posts/:id', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = posts.find(p => p.id === postId);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching post',
            error: error.message
        });
    }
});

// POST /posts - Create a new post
app.post('/posts', (req, res) => {
    try {
        const { title, author, category, content, image } = req.body;
        
        // Validate required fields
        if (!title || !author || !category || !content) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title, author, category, content'
            });
        }
        
        // Create new post
        const newPost = {
            id: posts.length + 1,
            title,
            author,
            date: new Date().toISOString().split('T')[0],
            category,
            content,
            image: image || 'https://via.placeholder.com/400x200/7000ff/ffffff?text=New+Post',
            likes: 0,
            comments: 0
        };
        
        // Add to posts array
        posts.push(newPost);
        
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: newPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating post',
            error: error.message
        });
    }
});

// PUT /posts/:id - Update a post
app.put('/posts/:id', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { title, author, category, content, image } = req.body;
        
        const postIndex = posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        // Update post
        posts[postIndex] = {
            ...posts[postIndex],
            title: title || posts[postIndex].title,
            author: author || posts[postIndex].author,
            category: category || posts[postIndex].category,
            content: content || posts[postIndex].content,
            image: image || posts[postIndex].image
        };
        
        res.json({
            success: true,
            message: 'Post updated successfully',
            data: posts[postIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating post',
            error: error.message
        });
    }
});

// DELETE /posts/:id - Delete a post
app.delete('/posts/:id', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const postIndex = posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        // Remove post
        const deletedPost = posts.splice(postIndex, 1)[0];
        
        res.json({
            success: true,
            message: 'Post deleted successfully',
            data: deletedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting post',
            error: error.message
        });
    }
});

// GET /posts/search - Search posts by title or content
app.get('/posts/search', (req, res) => {
    try {
        const query = req.query.q;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query parameter required'
            });
        }
        
        const searchTerm = query.toLowerCase();
        const results = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.content.toLowerCase().includes(searchTerm)
        );
        
        res.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching posts',
            error: error.message
        });
    }
});

// ============================================
// Health Check Endpoint
// ============================================

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'AnimeVerse API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// ============================================
// Error Handling Middleware
// ============================================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║   🎌 AnimeVerse API Server                            ║
    ║                                                       ║
    ║   Server running on http://localhost:${PORT}          ║
    ║                                                       ║
    ║   Available Endpoints:                                ║
    ║   - GET    /posts          Get all posts              ║
    ║   - GET    /posts/:id      Get single post            ║
    ║   - POST   /posts          Create new post            ║
    ║   - PUT    /posts/:id      Update post                ║
    ║   - DELETE /posts/:id      Delete post                ║
    ║   - GET    /posts/search   Search posts               ║
    ║   - GET    /health         Health check               ║
    ║                                                       ║
    ║   Sample Data: ${posts.length} posts loaded              ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
    `);
});

// ============================================
// Graceful Shutdown
// ============================================

process.on('SIGINT', () => {
    console.log('\nShutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nShutting down server gracefully...');
    process.exit(0);
});

module.exports = app;