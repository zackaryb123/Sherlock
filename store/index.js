import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import rootReducer from '../reducers';

const config = {
  key: 'root',
  storage: AsyncStorage
};

let reducers = persistReducer(config, rootReducer);

export const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(thunk)
  )
);

export const persistor = persistStore(store);
