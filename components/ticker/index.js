import React, { Component } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

const numberRange = Array(10)
  .fill()
  .map((x, i) => i);

const getPosition = (value, height) => parseInt(value, 10) * height * -1;
const getTranslateStyle = position => ({
  transform: [
    {
      translateY: position,
    },
  ],
});

export default class Ticker extends Component {

  componentWillMount() {
    this.animation = new Animated.Value(getPosition(this.props.value, this.props.height));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.value !== prevProps.value) {
      Animated.timing(this.animation, {
        toValue: getPosition(this.props.value, this.props.height),
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const transformStyle = getTranslateStyle(this.animation);

    return (
      <Animated.View style={transformStyle}>
        {numberRange.map(v => {
          return (
            <Text key={v} style={styles.text}>
              {v}
            </Text>
          );
        })}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
