import {
  SET_NEWS_HEADLINES,
  SET_NEWS_OPTIONS,
  SET_NEWS_CATEGORY,
  INCREMENT_ARTICLE_INDEX,
  DEINCREMENT_ARTICLE_INDEX
} from "./types";
import {NEWS_API_URI} from "../config/appConstants";
import {determineNewsOption} from "../utils/newsApiUtils";

export const setNewsHeadlines = (articles) => {
  return {
    type: SET_NEWS_HEADLINES,
    payload: articles
  };
};

export const setNewsOptions = (options) => {
  return {
    type: SET_NEWS_OPTIONS,
    payload: options
  };
};

export const setNewsCategory = (category) => {
  return {
    type: SET_NEWS_CATEGORY,
    payload: category
  }
};

export const incrementArticleIndex = (index) => {
  return {
    type: INCREMENT_ARTICLE_INDEX,
    payload: index+1
  };
};

export const deincrementArticleIndex = (index) => {
  return {
    type: DEINCREMENT_ARTICLE_INDEX,
    payload: index-1
  };
};

export const setCategory = (category) => dispatch => {
  dispatch(setNewsCategory(category))
};

export const getArticles = (country, categoty) => dispatch => {
  fetch(`${NEWS_API_URI.TOPHEADLINES}country=${country}&category=${categoty}&apiKey=${NEWS_API_URI.API_KEY}`, {
    method: 'GET'
  }).then((response) => response.json())
    .then((responseJson) => {
      let articleArr = [];
      responseJson.articles.map((article, index) => {
        if (article.title && article.description) {
          let keyValues = determineNewsOption(article);
          if (keyValues.length !== 0) {
            article.keyValues = keyValues;
            articleArr.push(article);
          }
        }
      });
      dispatch(setNewsHeadlines(articleArr));
    })
    .catch((error) => console.error(error));
};

export const getOptions = (keyValues, answer) => dispatch => {
  console.log("KEY VALUES: ", keyValues.join(' '));
  fetch(`${NEWS_API_URI.TOPHEADLINES}q=${keyValues[0]}&pageSize=6&apiKey=${NEWS_API_URI.API_KEY}`, {
    method: 'GET'
  }).then((response) => response.json())
    .then((resJson) => {
      let options = [];
      resJson.articles.some((article, index) => {
        if (article.title) options.push(article.title);
        if (options.length === 4) return true;
      });
      // Randomly insert the correct option
      console.log("Fetch Options", options);
      options[ Math.floor(Math.random() * 4)] = answer;
      dispatch(setNewsOptions(options));
    })
    .catch((error) => console.error(error));
};