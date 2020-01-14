import React, { Component } from 'react';
import {
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import {
  RkText,
  RkCard,
  RkStyleSheet,
  RkTheme
} from 'react-native-ui-kitten';
import categories from '../config/data/raw/categories';
import { Button } from 'react-native-elements';
import {FontAwesome} from './../assets/icons';
import {STYLES, THEME} from "../config/appConstants";

import {getArticles, setCategory} from "../actions/action.news.api";
import connect from "react-redux/es/connect/connect";
import {errorSet} from "../actions/action.auth";
import {authStateChanged} from "../actions/action.auth";


class Home_Screen extends Component {

  static navigationOptions = {
    headerTitle: 'Items',
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <RkText
        rkType='awesome'
        style={{
          color: tintColor,
          fontSize: 24,
          marginBottom: 0,
        }}>
          {FontAwesome.home}
      </RkText>
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      country: 'us',
      categories: categories
    };
    this.renderItem = this._renderItem.bind(this);
  }

  componentDidMount() {
    console.log('-----HOME SCREEN----------');
  }

  handleCategorySelect(category) {
    this.props.setCategory(category);
    this.props.getArticles(this.state.country, category);
    this.props.navigation.navigate('game_screen', {id:category})
  }

  _renderItem(category) {
    return (
      <TouchableOpacity style={styles.card} onPress={() => {this.handleCategorySelect(category.item.id)}}>
        <Image style={styles.image} source={category.item.photos[STYLES[THEME].THEME_ID]}/>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{category.item.name}</Text>
          <Text style={styles.count}>{category.item.name}</Text>
          <TouchableOpacity style={styles.followButton} onPress={()=> this.clickEventListener(category)}>
            <Text style={styles.followButtonText}>Explore now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  clickEventListener = (category) => {
    Alert.alert('Message', 'Item clicked. '+category.name);
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.contentList}
          columnWrapperStyle={styles.listContainer}
          data={categories}
          keyExtractor= {(category) => {
            return category.id;
          }}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container:{
    flex:1,
    marginTop:20,
    backgroundColor:"#ebf0f7"
  },
  contentList:{
    flex:1,
  },
  cardContent: {
    marginLeft:20,
    marginTop:10
  },
  image:{
    width:90,
    height:90,
    borderRadius:45,
    borderWidth:2,
    borderColor:"#ebf0f7"
  },

  card:{
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginLeft: 20,
    marginRight: 20,
    marginTop:20,
    backgroundColor:"white",
    padding: 10,
    flexDirection:'row',
    borderRadius:30,
  },

  name:{
    fontSize:18,
    flex:1,
    alignSelf:'center',
    color:"#3399ff",
    fontWeight:'bold'
  },
  count:{
    fontSize:14,
    flex:1,
    alignSelf:'center',
    color:"#6666ff"
  },
  followButton: {
    marginTop:10,
    height:35,
    width:100,
    padding:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "white",
    borderWidth:1,
    borderColor:"#dcdcdc",
  },
  followButtonText:{
    color: "#dcdcdc",
    fontSize:12,
  },

  // container: {
  //   backgroundColor: theme.colors.screen.scroll,
  //   paddingVertical: 8,
  //   paddingHorizontal: 14
  // },
  // card: {
  //   marginVertical: 8,
  //   height: 125
  // },
  // post: {
  //   marginTop: 5,
  //   marginBottom: 1
  // }
}));

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {
  errorSet, getArticles, setCategory, authStateChanged
})(Home_Screen);
