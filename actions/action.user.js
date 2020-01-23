import firebase from 'firebase';
import '@firebase/firestore';

import {
  SET_USER_POINTS,
  USERDETAILS_FETCH_SUCCESS
} from './types';

export const setUserPoints = (points) => dispatch => {
  dispatch({
    type: SET_USER_POINTS,
    payload: points
  });
};

export const setUserData = (user) => dispatch => {
  dispatch({
    type: USERDETAILS_FETCH_SUCCESS,
    payload: user
  })
};

export const userDetailsFetch = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.firestore().collection('users').doc(currentUser.uid).get().then(user => {
      if (user.exists) {
        dispatch(setUserData(user.data()));
      }
    });
  };
};

export const userPointsFetch = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.firestore().collection('users').doc(currentUser.uid).get().then(user => {
      if (user.exists && user.data().points) {
        dispatch(setUserPoints(user.data().points));
      }
    });
  }
};

export const addPoints = (uid, newPoints) => async dispatch => {
  const { currentUser } = firebase.auth();

  let oldPoints = await firebase.firestore().collection('users').doc(currentUser.uid).get().then(user => {return user.data().points});

  console.log('Old Points: ', oldPoints);

  if (oldPoints.toString()) {
    console.log('PASS');
    let points = oldPoints + newPoints;
    dispatch(setUserPoints(points));
    return await firebase.firestore().collection('users').doc(currentUser.uid).update({points})
  } else {
    console.log('FAIL');
    dispatch(setUserPoints(newPoints));
    return await firebase.firestore().collection('users').doc(currentUser.uid).set(newPoints);
  }
};

export const minusPoints = (uid, newPoints) => async dispatch => {
  const { currentUser } = firebase.auth();

  let oldPoints = await firebase.firestore().collection('users').doc(currentUser.uid).get().then(user => {return user.data().points});

  console.log('Old Points: ', oldPoints);

  if (oldPoints.toString() && oldPoints > 0) {
    console.log('PASS');
    let points = oldPoints - newPoints;
    dispatch(setUserPoints(points));
    return await firebase.firestore().collection('users').doc(currentUser.uid).update({points})
  } else {
    console.log('FAIL');
    let points = 0;
    dispatch(setUserPoints(0));
    return await firebase.firestore().collection('users').doc(currentUser.uid).update({points});
  }
};

export const searchUsers = (query, limitT) => async dispatch => {
  let users = firebase.database().ref(`users`).once('value').then((snapshot) => {
    if (snapshot.exists()) {return snapshot.val()}
  });

};
