import * as firebase from 'firebase';
import NavigatorService from "../utils/navigator";
import {loginUserSuccess, loginStatusChanged} from "./action.auth";

export const initApp = () => dispatch => {

  console.log("INIT APP");

  const auth = firebase.auth();
  /*TODO: Learn how to handle redirects in react-native*/
  const mode = null;
    // getUrlParameters('mode', "", true);
  const actionCode = null;
    // getUrlParameters('oobCode', "", true);

  // Check redirect mode url's
  if (mode) {
    switch (mode) {
      case 'resetPassword':
        handleResetPassword(auth, actionCode);
        break;
      case 'recoverEmail':
        handleRecoverEmail(auth, actionCode);
        break;
      case 'verifyEmail':
        handleVerifyEmail(auth, actionCode);
        break;
      default:
        console.log('Unhandled redirect mode: ', mode);
        break;
    }
  } else {
    checkAuthStateChange(auth);
  }

  function checkAuthStateChange(auth) {
    console.log("CHECK AUTH STATE CHANGE");
    auth.onAuthStateChanged(function (auth) {
      if (auth) {
        console.log('checkAuthStateChange: SUCCESS', auth);
        dispatch(loginUserSuccess(auth));
        dispatch(loginStatusChanged('loggedin'));
      } else {
        console.log('checkAuthStateChange: emailVerified: FAIL', auth);
        dispatch(loginStatusChanged('notloggedin'));
      }
    });
  }

  function handleVerifyEmail (auth, actionCode) {
    return auth.applyActionCode(actionCode).then(function (resp) {
      console.log('handleVerifyEmail: SUCCESS: ', resp);

    }).catch(function (error) {
      console.log('handleVerifyEmail: FAIL: ', error);
    });
  }

  function handleResetPassword(auth, actionCode) {
    auth.verifyPasswordResetCode(actionCode).then(function(email) {
      console.log('handleResetPassword: SUCCESS: ', email);
    }).catch(function(error) {
      console.log('handleResetPassword: FAIL: ', error);
    });
  }

  function handleRecoverEmail(auth, actionCode) {
    var restoredEmail = null;
    // Confirm the action code is valid.
    auth.checkActionCode(actionCode).then(function(info) {
      // Get the restored email address.
      restoredEmail = info['data']['email'];
      console.log('handleRecoverEmail: checkActionCode: ', restoredEmail);

      // Revert to the old email.
      return auth.applyActionCode(actionCode);
    }).then(function() {
      // Account email reverted to restoredEmail

      // TODO: Display a confirmation message to the user.

      // You might also want to give the user the option to reset their password
      // in case the account was compromised:
      auth.sendPasswordResetEmail(restoredEmail).then(function() {
        // Password reset confirmation sent. Ask user to check their email.
        console.log('handleRecoverEmail: sendPasswordResetEmail: SUCCESS');
      }).catch(function(error) {
        // Error encountered while sending password reset code.
        console.log('handleResetPassword: sendPasswordResetEmail: FAIL: ', error);

      });
    }).catch(function(error) {
      // Invalid code.
      console.log('handleRecoverEmail: FAIL: ', error);
    });
  }
};

export const handleConfirmPasswordReset = (actionCode, newPassword) => dispatch => {
  firebase.auth().confirmPasswordReset(actionCode, newPassword).then(function(resp) {
    console.log('handleConfirmPasswordReset: SUCCESS', resp);

  }).catch(function(error) {
    console.log('handleConfirmPasswordReset: FAIL', error);

  });
};

export function getUrlParameters(parameter, staticURL, decode){
  var windowLocation = (window.location.search !== "")? window.location.search : window.location.hash;
  var currLocation = (staticURL && staticURL.length)? staticURL : windowLocation;

  if(currLocation !== ""){
    var parArr = currLocation.split("?")[1].split("&");
    var returnBool = true;

    for(var i = 0; i < parArr.length; i++){
      var parr = parArr[i].split("=");
      if(parr[0] === parameter){
        return (decode) ? decodeURIComponent(parr[1]) : parr[1];
      }else{
        returnBool = false;
      }
    }

    if(!returnBool) return false;
  }else{
    return false;
  }
}

export function getHashParameters(parameter, decode){
  var windowLocation = window.location.hash;

  if(windowLocation !== ""){
    var parArr = windowLocation.split("&");
    var returnBool = true;

    for(var i = 0; i < parArr.length; i++){
      var parr = parArr[i].split("=");
      if(parr[0] === parameter){
        return (decode) ? decodeURIComponent(parr[1]) : parr[1];
      }else{
        returnBool = false;
      }
    }

    if(!returnBool) return false;
  }else{
    return false;
  }
}