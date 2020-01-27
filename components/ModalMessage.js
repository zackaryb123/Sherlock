import React, { Component } from 'react';
import {View, Text, Platform, Animated, Image} from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { errorSet, setUserSearch } from '../actions';
import { Button } from 'react-native-elements';
import {
  RkText
} from 'react-native-ui-kitten';
import {GradientButton} from './../components/';
import Ticker from './ticker';

class ModalMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measured: false,
      height: '0',
      value1: '0',
      value2: '0',
      value3: '0'
    };
  }

  handleLayout = e => {
    this.setState({
      measured: true,
      height: e.nativeEvent.layout.height,
    });
  };

  renderTicker = () => {
    const { height, measured } = this.state;
    const { userPoints } = this.props;
    const wrapStyle = measured ? { height } : styles.measure;

    const ticks = [];
    for (let i = 0; i < userPoints.toString().length; i++) {
      ticks.push(<Ticker key={`tick${i}`} value={userPoints.toString().length > i ? userPoints.toString().substring(i, i+1) : '0'} height={height}/>)
    }

    return (
      <View style={styles.container}>
        <View style={[styles.row, wrapStyle]}>
          {ticks}
        </View>
        <Text style={[styles.text, styles.measure]} onLayout={this.handleLayout}/>
      </View>)
  };

  renderSearchDetails = () => {
    const {userSearch} = this.props;
    return (
      <View style={styles.container}>
        <Image style={styles.avatar} source={{uri: userSearch.avatar}}/>
        <Text>{userSearch.name}</Text>
        <Text>{userSearch.uid}</Text>
      </View>
    )
  };

  handleOnClose = () => {
    this.props.errorSet('');
    const {userPoints, userSearch} = this.props;
    if (userSearch) {
      this.props.setUserSearch(null);
    }
  };

  renderModalContent = () => {
    const {userPoints, userSearch} = this.props;
    return(
      <View style={styles.modalContent}>
        <View style={{marginTop: 10, marginLeft: 5, marginRight: 5, marginBottom: 25}}>
          <RkText rkType='header6' > {this.props.error} </RkText>
        </View>
        {userPoints === 0 || userPoints && this.renderTicker()}
        {userSearch && this.renderSearchDetails()}
        <GradientButton onPress={ this.handleOnClose } rkType='medium' text='Close'/>
      </View>)
  };

  render() {
    return (
      <View>
        <Modal
          isVisible={this.props.error !== ''}
          animationIn={'slideInLeft'}
          animationOut={'slideOutRight'}
          style={styles.bottomModal}
          backdropOpacity={Platform.OS === 'android'? 0.4 : 0.7}
        >
          {this.renderModalContent()}
        </Modal>
      </View>
    );
  }
}

const styles = {
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'center',
    margin: 0,
  },
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  measure: {
    opacity: 0,
  },
  row: {
    overflow: "hidden",
    flexDirection: "row",
  },
  text: {
    fontSize: 80,
    color: "#333",
    textAlign: 'center',
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
};

const mapStateToProps = ({ auth }) => {
  const { error } = auth;
  return { error };
};

export default connect(mapStateToProps, {
  errorSet, setUserSearch
})(ModalMessage);
