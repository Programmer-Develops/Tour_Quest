import { START_LOADING, END_LOADING, FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, LIKE, HELPFUL, COMMENT, FETCH_BY_CREATOR } from '../constants/actionTypes';

const postsReducer = (state = { isLoading: true, posts: [] }, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };

    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };

    case FETCH_BY_SEARCH:
    case FETCH_BY_CREATOR:
      return {
        ...state,
        posts: action.payload.data,
      };

    case FETCH_POST:
      return {
        ...state,
        post: action.payload.post,
      };

    case LIKE:
      return {
        ...state,
        posts: state.posts.map((p) =>
          p._id === action.payload._id
            ? { ...p, likes: action.payload.likes || [] }
            : p
        ),
        post: state.post?._id === action.payload._id
          ? { ...state.post, likes: action.payload.likes || [] }
          : state.post,
      };
    
    case HELPFUL:
      return {
        ...state,
        posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)),
        post: action.payload._id === state.post?._id ? { ...action.payload } : state.post,
      };
      
    case COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id === action.payload._id) {
            return action.payload; 
          }
          return post;
        }),
        post: action.payload,
      };

    case CREATE:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };

    case UPDATE:
      return {
        ...state,
        posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)),
        post: action.payload._id === state.post?._id ? action.payload : state.post,
      };

    case DELETE:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
        post: action.payload === state.post?._id ? null : state.post,
      };

    default:
      return state;
  }
};

export default postsReducer;