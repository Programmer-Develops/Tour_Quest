import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  selectedFile: String,

  // REPLACE likeCount & isLiked with:
  likes: {
    type: [String], // Array of user IDs (Google ID or Mongo _id)
    default: [],
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;