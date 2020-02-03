import React, {Component} from 'react'
import {View, Button, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import '@firebase/firestore';


class ToggleFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendRequested: false,
      loading: true
    }
  }

  componentWillMount() {

  }


  componentDidMount() {
    console.log('-------CDM TOGGLE FRIEND-------');
    const { currentUser } = firebase.auth();
    const { userSearch } = this.props;
    if (userSearch) {
      firebase.firestore().collection('users').doc(userSearch.uid).collection('friendRequest').doc(currentUser.uid).get().then(user => {
        this.setState({friendRequested: user.exists, loading: false})
      })
    }
  }


  toggleFriendRequest() {
    const {userSearch} = this.props;
    const { currentUser } = firebase.auth();
    let uid = currentUser.uid;
     this.setState({loading: true});
     if (this.state.friendRequested) {
       firebase.firestore().collection('users').doc(userSearch.uid).collection('friendRequest').doc(currentUser.uid).delete().then(() => {
        this.setState({friendRequested: false, loading: false})
      });
    } else {
      firebase.firestore().collection('users').doc(userSearch.uid).collection('friendRequest').doc(currentUser.uid).set({uid}).then(() => {
        this.setState({friendRequested: true, loading: false})
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading
          ?
          <ActivityIndicator size="large" color="#0000ff" />
          :
          <Button
            color={this.state.friendRequested && '#787878'}
            onPress={() => this.toggleFriendRequest()}
            title={ this.state.friendRequested ? 'Friend Requested' : 'Request Friend' }/>
        }
      </View>
    )
  }
}

const mapStateToProps = ({ userData }) => {
  const { userdetais } = userData;
  return { userdetais };
};

export default connect(mapStateToProps, {

})(ToggleFriend);

let styles = {
  container: {

  }
};