// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Post = require('../models/Post');

// CRUD operations for posts

// Create a new post
router.post('/', auth, async (req, res) => {
    try {
        const { title, body, location } = req.body;
        const createdBy = req.user.userId;

        const newPost = new Post({
            title,
            body,
            createdBy,
            location
        });
        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Retrieve posts by latitude and longitude
router.get('/', auth, async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        // Implement logic to find posts by location

        res.status(200).json({ message: 'Posts retrieved successfully', posts: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a post
router.put('/:postId', auth, async (req, res) => {
    try {
        const { title, body, active } = req.body;
        const { postId } = req.params;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the authenticated user owns the post
        if (post.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update the post
        post.title = title || post.title;
        post.body = body || post.body;
        post.active = active !== undefined ? active : post.active;
        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a post
router.delete('/:postId', auth, async (req, res) => {
    try {
        const { postId } = req.params;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the authenticated user owns the post
        if (post.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete the post
        await post.remove();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
