import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

export const getPosts = async (req, res) => { 
    try {
        const postMessages = await PostMessage.find();
                
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const { title, message, selectedFile, creator, tags } = req.body;

    const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    try {
        const result = await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
        return res.json(result);
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ message: 'Failed to update post', error: error.message });
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    try {
        await PostMessage.findByIdAndDelete(id);
        return res.json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Failed to delete post', error: error.message });
    }
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    try {
        const post = await PostMessage.findById(id);
        if (!post) return res.status(404).send(`No post with id: ${id}`);
        
        // Toggle the like status
        const updatedPost = await PostMessage.findByIdAndUpdate(
            id, 
            { 
                likeCount: post.likeCount > 0 ? 0 : 1,  // Toggle between 0 and 1
                isLiked: !post.isLiked  // Toggle the liked status
            },
            { new: true }
        );
        return res.json(updatedPost);
    } catch (error) {
        console.error('Error toggling like:', error);
        return res.status(500).json({ message: 'Failed to toggle like', error: error.message });
    }
}


export default router;