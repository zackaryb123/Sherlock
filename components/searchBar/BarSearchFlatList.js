import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
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
    this.setState({ loading: true });
    if (this.state.timeout) {clearTimeout(this.state.timeout)}
    this.state.timeout = setTimeout(() => {
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
    }, 1000);
    this.setState({search});
  };

  renderSeparator = () => {
    return (<View style={{height: 1, width: '86%', backgroundColor: '#CED0CE', marginLeft: '14%'}}/>);
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

  handleOnItemSelect = async (item) => {
    console.log("ITEM: ", item);
    console.log("DATA: ", this.state.data);
    let selectedUser = this.state.data.map(user => {
      if (user.uid === item.uid) return user;
    });
    console.log("SELECTED USER: ", selectedUser[0]);
    await this.props.setUserSearch(selectedUser[0]);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={this.state.data}
          extraData={this.state}
          renderItem={({ item }) => (
            this.state.loading ? <View style={{ alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View> :
            <ListItem
              button
              onPress={() => this.handleOnItemSelect(item)}
              leftAvatar={{ source: { uri: item.avatar } }}
              title={item.displayName}
              subtitle={item.email}
            />
          )}
          keyExtractor={item => item.uid}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </ScrollView>
    );
  }
}

let styles = {
  container: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0
  }
};

const mapStateToProps = ({ userData }) => {
  const { userSearch } = userData;
  return { userSearch };
};

export default connect(mapStateToProps, {
  setUserSearch
})(BarSearchFlatList);