import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

export const getPosts = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByCreator = async (req, res) => {
    const { name } = req.query;

    try {
        const posts = await PostMessage.find({ name });

        res.json({ data: posts });
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
  const post = req.body;

  // This line MUST use req.userId, not post.name or anything else
  const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

  try {
    await newPostMessage.save();
    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const postData = req.body; // Contains title, message, tags, etc.

  // 1. Check if user is authenticated
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  // 2. Check for a valid ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }

  try {
    // 3. Find the post
    const post = await PostMessage.findById(id);
    if (!post) {
      return res.status(404).send(`No post with id: ${id}`);
    }

    // 4. Check if the authenticated user is the creator
    if (String(post.creator) !== String(req.userId)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to edit this post." });
    }

    // 5. If all checks pass, update the post
    const updatedPost = await PostMessage.findByIdAndUpdate(id, postData, { new: true });
    
    res.json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    // 1. Check if user is authenticated
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    // 2. Check if the ID is a valid Mongoose ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with id: ${id}`);
    }

    try {
        // 3. Find the post to get the creator's ID
        const post = await PostMessage.findById(id);

        if (!post) {
            return res.status(404).send(`No post with id: ${id}`);
        }

        // 4. Check if the authenticated user is the creator
        if (String(post.creator) !== String(req.userId)) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to delete this post." });
        }

        // 5. If all checks pass, delete the post
        await PostMessage.findByIdAndDelete(id);

        res.json({ message: "Post deleted successfully." });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  try {
    // This is the new, safer logic.
    // It finds the post by 'id', uses MongoDB's '$push' operator
    // to add the 'value' to the 'comments' array, and
    // '{ new: true }' ensures it returns the *updated* post.
    const updatedPost = await PostMessage.findByIdAndUpdate(
      id,
      { $push: { comments: value } },
      { new: true }
    );

    // If the post doesn't exist (e.g., bad ID)
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Send the updated post back to the frontend
    res.status(200).json(updatedPost);

  } catch (error) {
    console.log("COMMENT POST ERROR:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export default router;