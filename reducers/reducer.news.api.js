import {
  SET_NEWS_HEADLINES,
  SET_NEWS_OPTIONS,
  INCREMENT_ARTICLE_INDEX,
  DEINCREMENT_ARTICLE_INDEX, SET_NEWS_CATEGORY
} from '../actions/types';

const INITIAL_STATE = {
  articleIndex: 0,
  articlesSize: 20,
  category: null,
  articles: null,
  options: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_NEWS_HEADLINES:
      return { ...state, articles: action.payload };
    case SET_NEWS_OPTIONS:
      return { ...state, options: action.payload };
    case SET_NEWS_CATEGORY:
      return { ...state, category: action.payload };
    case INCREMENT_ARTICLE_INDEX:
      return { ...state, articleIndex: action.payload };
    case DEINCREMENT_ARTICLE_INDEX:
      return { ...state, articleIndex: action.payload };
    default:
      return state;
  }
};
