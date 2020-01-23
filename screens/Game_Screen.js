import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
  ActivityIndicator,
  Button, Linking,
  View, TouchableOpacity,
  TouchableHighlight, Image
} from 'react-native';
import Swiper from 'react-native-swiper';
import {Card, ListItem, CheckBox, Overlay } from 'react-native-elements';
import {GradientButton} from "../components";
import {RkStyleSheet} from "react-native-ui-kitten";
import {setError} from "../actions/action.auth";
import {userPointsFetch} from '../actions/action.user';
import {getArticles, getOptions} from "../actions/action.news.api";
import {addPoints, errorSet, minusPoints} from "../actions";
import ModalMessage from "../components/ModalMessage";

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
      answer: null,
      guessed: false
    }
  }

  componentDidMount() {
    const { articles } = this.props;
    const { swipeIndex } = this.state;
    if (articles) {
      this.setState({ loadingOptions: true, answer: articles[swipeIndex].title });
      this.props.getOptions(articles[swipeIndex].keyValues, articles[swipeIndex].title);
    }
    this.props.userPointsFetch();
  }

  componentWillReceiveProps(nextProps) {
    const {swipeIndex} = this.state;
    if (this.props.articles !== nextProps.articles) {
      this.setState({ articles: nextProps.articles, answer: nextProps.articles[swipeIndex].title, loadingOptions: true });
    } else if (this.props.options !== nextProps.options) {
      this.setState({ options: nextProps.options })
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
      this.setState({swipeIndex: swipeIndex, loadingOptions: true, answer: articles[swipeIndex].title, checked: null, guessed: false});
  };

  handleGuess() {
    console.log('Guess');
    const { answer, checked } = this.state;
    const { auth } = this.props;
    if (answer === checked) {
      this.props.addPoints(auth.uid, 10);
      this.props.errorSet('Correct!!');
    } else {
      this.props.minusPoints(auth.uid, 10);
      this.props.errorSet('Incorrect!!');
    }
    this.setState({guessed: true});
  }

  render() {
    const { loadingOptions, articles, options, checked, guessed, swipeIndex } = this.state;
    if (!articles) return <View style={[styles.container, styles.horizontal]}><ActivityIndicator size="large" color="#0000ff" /></View>;
    return (
      <View style={{ flex: 1}}>
        <ModalMessage userPoints={this.props.userPoints} />
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
                      : swipeIndex === i && options && options.map((opt, index) => {
                        return <CheckBox disabled={guessed} key={index} title={opt} checked={checked === opt} onPress={() => this.setChecked(opt)}/>
                      })
                  }
                  <GradientButton
                    disabled={checked === null || guessed}
                    rkType='large'
                    style={styles.button}
                    text="GUESS"
                    onPress={() => {this.handleGuess()}}/>
                  {guessed && <Button title="Link" onPress={() => {
                    Linking.canOpenURL(article.url).then(supported => {
                      if (supported) {Linking.openURL(article.url)}
                      else {this.props.setError('Url link is unsupported!')}
                    });
                  }}/>}
                </Card>
              </View>)
          })}
        </Swiper>
      </View>
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

const mapStateToProps = ({newsData, auth, userData}) => {
  const { options, articles, category } = newsData;
  const { userPoints, userDetails} = userData;
  return { options, articles, category, auth, userPoints, userDetails };
};

export default connect(mapStateToProps, {
  setError, getArticles, getOptions, addPoints, minusPoints, errorSet, userPointsFetch
})(Game_Screen);