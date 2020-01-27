import React, { Component, Fragment } from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import connect from "react-redux/es/connect/connect";
import {searchUsers} from "../../actions";
import firebase from "firebase";
import '@firebase/firestore';
import {setUserSearch} from "../../actions/action.user";

class BarSearchDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      items: []
    }
  }

  handleOnTextChange = search => {
    if (this.state.timeout) clearTimeout(this.state.timeout);
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
        this.setState({items: userList})
      });
    }, 3000);
    this.setState({ search });
  };

  handleOnItemSelect = async (item) => {
    let selectedUser = this.state.items.map(user => {
      if (user.uid === item.uid) return user;
    });
    await this.props.setUserSearch(selectedUser[0]);
  };

  render() {
    return (
      <Fragment>

        <SearchableDropdown
          onItemSelect={(item) => this.handleOnItemSelect(item)}
          containerStyle={{ padding: 5 }}
          onRemoveItem={(item, index) => {
            const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
            this.setState({ selectedItems: items });
          }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: '#ddd',
            borderColor: '#bbb',
            borderWidth: 1,
            borderRadius: 5,
          }}
          itemTextStyle={{ color: '#222' }}
          itemsContainerStyle={{ maxHeight: 140 }}
          items={this.state.items}
          defaultIndex={2}
          resetValue={false}
          textInputProps={
            {
              placeholder: "Search Friends (name, email, phone)...",
              underlineColorAndroid: "transparent",
              style: {
                padding: 12,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
              },
              onTextChange: text => this.handleOnTextChange(text)
            }
          }
          listProps={{ nestedScrollEnabled: true }}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ userData }) => {
  const { userSearch } = userData;
  return { userSearch };
};


export default connect(mapStateToProps, {
  setUserSearch
})(BarSearchDropdown);