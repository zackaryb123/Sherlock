import { combineReducers } from 'redux';
import AuthReducer from './reducer.auth';
import FacebookReducer from './reducer.facebook';
import UserDataReducer from './reducer.user';
import NewsDataReducer from './reducer.news.api';

export default combineReducers({
  auth: AuthReducer,
  fbauth: FacebookReducer,
  userData: UserDataReducer,
  newsData: NewsDataReducer
});
