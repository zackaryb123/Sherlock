import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View, Text, Linking} from 'react-native';
import {RkStyleSheet} from "react-native-ui-kitten";

export class OpenURLButton extends React.Component {
  static propTypes = { url: PropTypes.string };
  handleClick = () => {
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };
  render() {
    return (
      <TouchableOpacity onPress={this.handleClick}>
        {" "}
        <View style={styles.button}>
          {" "}<Text style={styles.text}>Open {this.props.url}</Text>{" "}
        </View>
        {" "}
      </TouchableOpacity>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  text: {
  },
  button: {
    marginTop: 25,
    marginHorizontal: 16,
    marginBottom: 25
  }
}));