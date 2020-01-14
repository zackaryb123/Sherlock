import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
  ActivityIndicator,
  Button, Linking,
  View, Image, TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import Swiper from 'react-native-swiper';
import {Card, ListItem, CheckBox } from 'react-native-elements';
import {GradientButton} from "../components";
import {RkStyleSheet} from "react-native-ui-kitten";
import {setError} from "../actions/action.auth";
import {getArticles, getOptions} from "../actions/action.news.api";
import {addPoints, minusPoints} from "../actions";

class Game_Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: 'us',
      articles: null,
      swipeIndex: 0,
      options: null,
      loadingOptions: true,
      checked: null,
      answer: null
    }
  }

  componentDidMount() {
    console.log("AUTH: ", this.props.auth);
    const { articles } = this.props;
    const { swipeIndex } = this.state;
    if (articles) {
      this.setState({ loadingOptions: true, answer: articles[swipeIndex].title });
      this.props.getOptions(articles[swipeIndex].keyValues, articles[swipeIndex].title);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {swipeIndex} = this.state;
    if (this.props.articles !== nextProps.articles) {
      this.setState({ articles: nextProps.articles, answer: nextProps.articles[swipeIndex].title, loadingOptions: true });
    } else if (this.props.options !== nextProps.options) {
      console.log("OPTIONS: ", nextProps.options);
      this.setState({ options: nextProps.options })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    switch (true) {
      default:
        return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {articles, swipeIndex } = this.state;
    switch (true) {
      case this.state.articles !== prevState.articles:
        this.setState({ loadingOptions: true });
        return this.props.getOptions(articles[swipeIndex].keyValues, articles[swipeIndex].title);
      case this.state.options !== prevState.options:
        return this.setState({ loadingOptions: false });
      default:
        return null;
    }
  }

  setChecked = (option) => {
    this.setState({checked: option});
  };

  onSwipe = (swipeIndex) => {
    const { articles } = this.state;
      this.props.getOptions(articles[swipeIndex].keyValues, articles[swipeIndex].title);
      this.setState({swipeIndex: swipeIndex, loadingOptions: true, answer: articles[swipeIndex].title});
  };

  handleGuess() {
    const { answer, checked } = this.state;
    const { user } = this.props;
    console.log("Answer: ", answer);
    console.log("Checked: ", checked);
    if (answer === checked) {
      console.log('Correct!!!');
      this.props.addPoints(user.uid, 10);
    } else {
      console.log('Incorrect...');
      this.props.minusPoints(user.uid, 10);
    }
  }

  render() {
    const { loadingOptions, articles, options, checked } = this.state;
    if (!articles) return <View style={[styles.container, styles.horizontal]}><ActivityIndicator size="large" color="#0000ff" /></View>;
    return (
      <Swiper loop={false} onIndexChanged={this.onSwipe} showsButtons>
        {articles && articles.map((article, i) => {
          return (
            <View key={i}>
              <Card
                containerStyle={{padding: 0}}
                title={article.source.name}
                image={{uri:article.urlToImage}}>
                {
                  loadingOptions ? <ActivityIndicator size="large" color="#0000ff" />
                    : options && options.map((opt, index) => {
                      return <CheckBox key={index} title={opt} checked={checked === opt}
                        onPress={() => this.setChecked(opt)}/>})
                }
                <GradientButton
                  rkType='large'
                  style={styles.button}
                  text="GUESS"
                  onPress={() => {this.handleGuess()}}/>
                <Button title="Link" onPress={() => {
                  Linking.canOpenURL(article.url).then(supported => {
                    if (supported) {
                      Linking.openURL(article.url);
                    } else {
                      this.props.setError('Url link is unsupported!');
                    }
                  });
                }} />
              </Card>
            </View>)
        })}
      </Swiper>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    backgroundColor: theme.colors.screen.base,
    paddingVertical: 0,
    alignItems: 'center',
    flex: 1,
  },
  button: {
    marginTop: 25,
    marginHorizontal: 16,
    marginBottom: 25
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
}));

/*
<View>
  <Button
    large
    title="Log out"
    backgroundColor="#00aced"
    icon={{ type: 'font-awesome', color: "#ffffff", name: 'sign-out' }}
    onPress={ () => this.props.navigation.navigate('location_screen') }
  />
</View>
*/

const mapStateToProps = ({newsData, auth}) => {
  const { options, articles, category } = newsData;
  const { user } = auth;
  return { options, articles, category, auth, user };
};

export default connect(mapStateToProps, {
  setError, getArticles, getOptions, addPoints, minusPoints
})(Game_Screen);