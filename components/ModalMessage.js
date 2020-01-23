import React, { Component } from 'react';
import { View, Text, Platform, Animated } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { errorSet } from '../actions';
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

  renderModalContent = () => {
    const {userPoints} = this.props;
    console.log(userPoints);

    return(
      <View style={styles.modalContent}>
        <View style={{marginTop: 10, marginLeft: 5, marginRight: 5, marginBottom: 25}}>
          <RkText rkType='header6' > {this.props.error} </RkText>
        </View>
        {userPoints === 0 || userPoints && this.renderTicker()}
        <GradientButton onPress={ () => this.props.errorSet('') } rkType='medium' text='Close'/>
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
  }
};

const mapStateToProps = ({ auth }) => {
  const { error } = auth;
  return { error };
};

export default connect(mapStateToProps, {
  errorSet
})(ModalMessage);
