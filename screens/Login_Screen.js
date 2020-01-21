import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Login from './../components/Login/Login';
import { facebookSignin } from '../actions';
import NavigatorService from './../utils/navigator';
import firebase from "firebase";


class Login_Screen extends Component {

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    console.log('-----LOGIN SCREEN MOUNTED----------');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('-----LOGIN SCREEN UPDATED----------');
    firebase.auth().onAuthStateChanged((auth) => {
      if (auth) { NavigatorService.reset('main_screen') }
    });
  }

  render() {
    console.log('Login_Screen:Line 15: Rendering Login_Screen');
      return (
          <Login
            emailPwdBtnStr='SignIn'
            fbBtnStr='Facebook Signin'
            showEmailPwdOption={true}
            onNavString1='Don’t have an account?'
            onNavString2=' Sign Up now'
            onNavPress={ () => { NavigatorService.reset('profile_screen'); } }
            onForgotPassword={ () => {  NavigatorService.reset('reset_screen'); } }
          />
      )
  }
}

const mapStateToProps = ({ auth }) => {
  const { loginStatus } = auth;
  return { loginStatus };
};


export default connect(mapStateToProps, {
  facebookSignin
})(Login_Screen);
