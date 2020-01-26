import { SearchBar } from 'react-native-elements';
import React, { Component }  from 'react'

export class BarSearch extends Component {
    state = {
        search: '',
    };

    updateSearch = search => {
        this.setState({ search });
    };

    render() {
        const { search } = this.state;

        return (
            <SearchBar
                placeholder="Type Here..."
                onChangeText={this.updateSearch}
                value={search}
            />
        );
    }
}