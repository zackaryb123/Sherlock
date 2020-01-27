import React, { Component } from 'react';
import firebase from 'firebase';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import {
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet
} from 'react-native-ui-kitten';


import { Header } from 'react-navigation';
import { Button } from 'react-native-elements';
import { logoutUser, userDetailsFetch, setError } from '../actions';


import users from '../config/data/raw/users';
import {Avatar} from './../components';
import {GradientButton, BarSearch, BarSearchDropdown} from './../components/';
import {FontAwesome} from './../assets/icons';
import LoadingSpinner from './../components/Loading/LoadingSpinner';
import NavigatorService from './../utils/navigator';
import {errorSet} from "../actions/action.auth";
import ModalMessage from "../components/ModalMessage";

class Settings_Screen extends Component {
  constructor(props) {
    super(props);
    this.user = users[0];

    this.state = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
    }
  }

  componentWillMount() {
    this.props.userDetailsFetch();
    if ( this.props.userdetails ) {
      const {myfirstname} = this.props.userdetails;
      this.setState({ firstName: myfirstname });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    firebase.auth().onAuthStateChanged((auth) => {
      if (!auth) {
        NavigatorService.reset('login_screen');
      }
    });
    if (this.props.userSearch) {
      this.props.errorSet(this.props.userSearch.name);
    }
  }

  render() {
    console.log('userdetails: ', this.props.userdetails);
    console.log('userSearch: ', this.props.userSearch);
    // console.log('RkTheme.current.colors.accent = ' + RkTheme.current.colors.acc);
    // console.log('RkTheme.current.colors.alterBackground = ' + RkTheme.current.colors.alterBackground);
    const {userdetails, userSearch} = this.props;
    if (!userdetails) return <View style={[styles.container, styles.horizontal]}><ActivityIndicator size="large" color="#0000ff" /></View>;
    return (
        <View style={styles.container}>
          <ModalMessage userSearch={userSearch} />
          <BarSearchDropdown/>
          <Image style={styles.avatar} source={{uri: userdetails.avatar}}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{userdetails.firstname}</Text>
              <Text style={styles.info}>{userdetails.email}</Text>
              <Text style={styles.description}>{userdetails.bio}</Text>
              {/*<TouchableOpacity style={styles.buttonContainer}>*/}
                {/*<Text>Opcion 1</Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity style={styles.buttonContainer}>*/}
                {/*<Text>Opcion 2</Text>*/}
              {/*</TouchableOpacity>*/}
              <GradientButton
                rkType='large'
                style={styles.button}
                text='Sign Out'
                onPress={ () => this.props.logoutUser()  }
              />
            </View>
          </View>
        </View>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    // flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  root: {
    backgroundColor: theme.colors.screen.base
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32
  },
  header:{
    backgroundColor: "#00BFFF",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    marginTop:20
  },
  // name:{
  //   fontSize:22,
  //   color:"#FFFFFF",
  //   fontWeight:'600',
  // },
  body:{
    marginTop:40,
  },
  bodyContent: {
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
}));

const mapStateToProps = ({ userData, auth }) => {
  const { userdetails, userSearch } = userData;
  const {loginStatus } = auth;
  return { userdetails, userSearch, loginStatus };
};

export default connect(mapStateToProps, {
  logoutUser, userDetailsFetch, errorSet
})(Settings_Screen);
