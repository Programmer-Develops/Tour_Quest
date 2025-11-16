import {
  START_LOADING,
  END_LOADING,
  FETCH_ALL,
  FETCH_POST,
  FETCH_BY_SEARCH,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
  HELPFUL,
  COMMENT,
  FETCH_BY_CREATOR,
} from '../constants/actionTypes';
import * as api from '../api/index.js';

export const fetchPosts = (page = 1) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data, currentPage, numberOfPages },
    } = await api.fetchPosts(page);

    dispatch({
      type: FETCH_ALL,
      payload: { data, currentPage, numberOfPages },
    });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('fetchPosts error:', error);
    dispatch({ type: END_LOADING });
  }
};

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPost(id);
    dispatch({ type: FETCH_POST, payload: { post: data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('getPost error:', error);
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data, currentPage, numberOfPages },
    } = await api.fetchPosts(page);

    dispatch({
      type: FETCH_ALL,
      payload: { data, currentPage, numberOfPages },
    });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('getPosts error:', error);
  }
};

export const getPostsByCreator = (name) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchPostsByCreator(name);

    dispatch({ type: FETCH_BY_CREATOR, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('getPostsByCreator error:', error);
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchPostsBySearch(searchQuery);

    dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('getPostsBySearch error:', error);
  }
};

export const createPost = (post, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
    navigate(`/posts/${data._id}`);
  } catch (error) {
    console.error('createPost error:', error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.error('updatePost error:', error);
  }
};

export const likePost = (id) => async (dispatch, getState) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  if (!user?.token) return;

  try {
    const { posts } = getState();
    const post = posts.posts.find(p => p._id === id);
    const currentLikes = Array.isArray(post?.likes) ? post.likes : [];
    const userId = user.result._id || user.result.googleId;
    const isLiked = currentLikes.includes(userId);
    const updatedLikes = isLiked
      ? currentLikes.filter(uid => uid !== userId)
      : [...currentLikes, userId];

    // Optimistic update
    dispatch({
      type: LIKE,
      payload: { ...post, likes: updatedLikes }
    });

    // Server update
    const { data } = await api.likePost(id, user.token);
    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.error('likePost error:', error);
  }
};

export const helpfulPost = (id) => async (dispatch) => {
  try {
    const { data } = await api.helpfulPost(id);
    dispatch({ type: HELPFUL, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);

    dispatch({ type: COMMENT, payload: data });
    return data.comments;
  } catch (error) {
    console.error('commentPost error:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.error('deletePost error:', error);
  }
};