import firebase from 'firebase';

import {
  SET_USER_POINTS,
  USERDETAILS_FETCH_SUCCESS
} from './types';

export const setUserPoints = (points) => {
  return {
    type: SET_USER_POINTS,
    payload: points
  };
};

export const userDetailsFetch = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/userDetails`)
      .on('value', snapshot => {
        dispatch({ type: USERDETAILS_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const addPoints = (uid, newPoints) => async dispatch => {
  let oldPoints = await firebase.database().ref(`users/${uid}/points`).once('value').then((snapshot) => {
    if (snapshot.exists()) { return snapshot.val()}
  });
  if (oldPoints) {
    let points = oldPoints + newPoints;
    dispatch(setUserPoints(points));
    return await firebase.database().ref(`users/${uid}`).update({points});
  } else {
    dispatch(setUserPoints(newPoints));
    return firebase.database().ref(`users/${uid}/points`).set(newPoints)
  }
};

export const minusPoints = (uid, newPoints) => async dispatch => {
  let oldPoints = await firebase.database().ref(`users/${uid}/points`).once('value').then((snapshot) => {
    if (snapshot.exists()) { return snapshot.val()}
  });
  let points = oldPoints - newPoints;
  if (oldPoints && points > 0) {
    dispatch(setUserPoints(points));
    return await firebase.database().ref(`users/${uid}`).update({points})
  } else {
    dispatch(setUserPoints(0));
    return firebase.database().ref(`users/${uid}/points`).set(0)
  }
};
