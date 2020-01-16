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

export const loginStatusChanged = (dispatch, text) => {
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


export const loginUserFail = (dispatch, err_message) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: err_message
  });
};

export const loginUserSuccess = (dispatch, user) => {
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
    loginStatusChanged(dispatch, 'checking');
    dispatch({ type: LOGIN_USER });
    try {
      let user = await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('user logged successfully');
      loginUserSuccess(dispatch, user);
      loginStatusChanged(dispatch, 'loggedin');
    }
    catch (error) {
      console.log(error);
      let err_message = error.message;
      loginUserFail(dispatch, err_message);
      loginStatusChanged(dispatch, 'notloggedin')
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
    loginStatusChanged(dispatch, 'checking');
    try {
      await firebase.auth().signOut();
      loginStatusChanged(dispatch, 'notloggedin');
      loginUserSuccess(dispatch, null);
    } catch (error) {
      console.log(error);
      loginStatusChanged(dispatch, 'loggedin');
    }
  };

};

export const signupUser = ({ email, password, phone, firstname, lastname  }) => {
  return async (dispatch) => {

    loginStatusChanged(dispatch, 'checking');
    dispatch({ type: SIGNUP_USER });
    var displayName = firstname + ' ' + lastname;
    var phoneNumber = '+1'+ phone;
    console.log(email);
    console.log(password);
    console.log(displayName);
    console.log(phoneNumber);

    try {
      let user = await firebase.auth().createUserWithEmailAndPassword(email, password);
      user.user.displayName = displayName;
      firebase.database().ref(`/users/${user.user.uid}/userDetails`).set({
        email,
        phone,
        firstname,
        lastname,
        displayName
      });
      loginUserSuccess(dispatch, user);
      loginStatusChanged(dispatch, 'notloggedin');
      dispatch(errorSet('Welcome to our Online Shop'));
    }
    catch (error) {
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
          loginUserSuccess(dispatch, user);
          loginStatusChanged(dispatch,'loggedin');
        } else {
         console.log('Authactions: Line 216: Dispatched not loggedin');
         loginStatusChanged(dispatch,'notloggedin');
        }
      });
  }

};
