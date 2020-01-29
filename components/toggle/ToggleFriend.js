import React, {Component} from 'react'
import {View, Button} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import '@firebase/firestore';


class ToggleFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendRequested: false
    }
  }

  componentDidMount() {
    console.log('-------CDM TOGGLE FRIEND-------');
    const { currentUser } = firebase.auth();
    const { userSearch } = this.props;
    if (userSearch) {
      firebase.firestore().collection('users').doc(userSearch.uid).get().then(user => {
        this.setState({friendRequested: user.data().friendRequest.includes(currentUser.uid)})
      })
    }
  }


  toggleFriendRequest() {
    const {userSearch} = this.props;
    const { currentUser } = firebase.auth();
    if (this.state.friendRequested) {
      firebase.firestore().collection('users').doc(userSearch.uid).update({
        friendRequest: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
      });
      this.setState({friendRequested: false})
    } else {
      firebase.firestore().collection('users').doc(userSearch.uid).update({
        friendRequest: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
      });
      this.setState({friendRequested: true})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.toggleFriendRequest()}
          title={ this.state.friendRequested ? 'Friend Requested' : 'Request Friend' }
        />
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