import {
  SET_USER_POINTS,
  USERDETAILS_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  userPoints: 0,
  userdetails: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USERDETAILS_FETCH_SUCCESS:
      return { ...state, userdetails: action.payload };
    case SET_USER_POINTS:
      return { ...state, userPoints: action.payload };
    default:
      return state;
  }
};
