import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import connect from "react-redux/es/connect/connect";
import {setUserSearch} from "../../actions/action.user";
import firebase from "firebase";

class BarSearchFlatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
    };
  }

  handleOnTextChange = search => {
    if (this.state.timeout) clearTimeout(this.state.timeout);
    this.state.timeout = setTimeout(() => {
      this.setState({ loading: true });
      console.log('Searching... ', search);
      firebase.firestore().collection('users').where('searchQuery', 'array-contains', search).get().then(users => {
        let index = 1;
        let userList = [];
        users.forEach(user => {
          let item = { id: index, name: user.data().displayName, ...user.data(), uid: user.id };
          userList.push(item);
          index++;
        });
        console.log('USERS: ', userList);
        this.setState({
          data: userList,
          loading: false
        });
      });
    }, 2000);
    this.setState({search});
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search Friends (name, email, phone)..."
        lightTheme
        onChangeText={this.handleOnTextChange}
        value={this.state.search}
      />
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View>
        <FlatList
          data={this.state.data}
          extraData={this.state}
          renderItem={({ item }) => (
            <ListItem
              leftAvatar={{ source: { uri: item.avatar } }}
              title={item.displayName}
              subtitle={item.email}
            />
          )}
          keyExtractor={item => item.uid}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ userData }) => {
  const { userSearch } = userData;
  return { userSearch };
};

export default connect(mapStateToProps, {
  setUserSearch
})(BarSearchFlatList);