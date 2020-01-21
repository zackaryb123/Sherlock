import firebase from 'firebase';

import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  PHONE_CHANGED,
  FIRSTNAME_CHANGED,
  LASTNAME_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGOUT_USER,
  LOGIN_STATUS_CHANGED,
  LOAD_WELCOME_CHANGED,
  EMAIL_RESET_CHANGED,
  FONT_LOADED_CHANGED,
  SIGNUP_USER,
  ERROR_SET,
  RESET_USER
} from './types';

import NavigatorService from './../utils/navigator';

export const errorSet = (text) => {
  return {
    type: ERROR_SET,
    payload: text
  };
};

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const fontLoadedChanged = (text) => {
  return {
    type: FONT_LOADED_CHANGED,
    payload: text
  };
};

export const emailResetChanged = (text) => {
  return {
    type: EMAIL_RESET_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const phoneChanged = (text) => {
  return {
    type: PHONE_CHANGED,
    payload: text
  };
};

export const firstnameChanged = (text) => {
  return {
    type: FIRSTNAME_CHANGED,
    payload: text
  };
};

export const lastnameChanged = (text) => {
  return {
    type: LASTNAME_CHANGED,
    payload: text
  };
};

export const loginStatusChanged = (text) => dispatch => {
  console.log ("login status : " + text);
  dispatch({
    type: LOGIN_STATUS_CHANGED,
    payload: text
  });
};

export const loadWelcomeChanged = (text) => {
  console.log ("load Windows Screen : " + text);
  return {
    type: LOAD_WELCOME_CHANGED,
    payload: text
  };
};


export const loginUserFail = (err_message) => dispatch => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: err_message
  });
};

export const loginUserSuccess = (user) => dispatch => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
};

export const setError = (message) => dispatch => {
  dispatch(errorSet(message));
};


export const loginUser = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(loginStatusChanged('checking'));
    try {
      let user = await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('user logged successfully');
      dispatch(loginUserSuccess(user));
      dispatch(loginStatusChanged('loggedin'));
    } catch (error) {
      console.log(error);
      let err_message = error.message;
      dispatch(loginUserFail(err_message));
      dispatch(loginStatusChanged('notloggedin'));
    }
  };
};

export const resetUser = ({ email }) => {
  return async (dispatch) => {
      try {
        await firebase.auth().sendPasswordResetEmail(email);
        dispatch(errorSet('Reset Email Sent'));
      } catch (error) {
        console.log(error);
        let err_message = error.message;
        dispatch(errorSet(err_message));
      }
  };

};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(loginStatusChanged('checking'));
    try {
      await firebase.auth().signOut();
      dispatch(loginStatusChanged('notloggedin'));
      dispatch(loginUserSuccess(null));
    } catch (error) {
      console.log(error);
      dispatch(loginStatusChanged('loggedin'));
    }
  };

};

export const signupUser = ({ email, password, phone, firstname, lastname  }) => {
  return async (dispatch) => {
    dispatch(loginStatusChanged('checking'));
    dispatch({ type: SIGNUP_USER });
    let displayName = firstname + ' ' + lastname;

    try {
      let user = await firebase.auth().createUserWithEmailAndPassword(email, password);
      let uid = user.user.uid;
      user.user.displayName = displayName;
      firebase.database().ref(`/users/${user.user.uid}/userDetails`).set({
        email, phone, firstname, lastname, displayName
      });
      // firebase.database().ref(`/userids/${email}`).set({
      //   uid
      // });
      dispatch(loginUserSuccess(user));
      dispatch(loginStatusChanged('notloggedin'));
      dispatch(errorSet('Welcome to Sherlock!'));
    } catch (error) {
      console.log("FAIL: ", error);
      loginUserFail(dispatch);
    }

  };
};

// Get message from firebase and do the reset
export const authStateChanged = () => {
  return async ( dispatch ) => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("USER: ", user);
        if (user) {
          console.log('Authactions: Line 260: Dispatched loggedin');
          dispatch(loginUserSuccess(user));
          dispatch(loginStatusChanged('loggedin'));
        } else {
         console.log('Authactions: Line 216: Dispatched not loggedin');
         dispatch(loginStatusChanged('notloggedin'));
        }
      });
  }

};
