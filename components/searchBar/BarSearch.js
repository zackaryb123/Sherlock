import { SearchBar } from 'react-native-elements';
import React, { Component }  from 'react'
import connect from "react-redux/es/connect/connect";
import { searchUsers} from "../../actions";

class BarSearch extends Component {
  state = {
    search: '',
    timeout: 0
  };

  updateSearch = search => {
    if (this.state.timeout) clearTimeout(this.state.timeout);
    this.state.timeout = setTimeout(() => {
      console.log('Searching... ', search);
      this.props.searchUsers(search);
    }, 3000);
    this.setState({ search });
  };

  render() {
    const { search } = this.state;
    return (
      <SearchBar
        lightTheme={true}
        containerStyle={{position: 'relative', top: 10}}
        placeholder="Search Friends (Name, email, phone)..."
        onChangeText={this.updateSearch}
        value={search}
      />
    );
  }
}

export default connect(null, {
  searchUsers
})(BarSearch);