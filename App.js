import Expo from 'expo';
import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import { Provider } from 'react-redux';
import {persistStore, persistReducer} from 'redux-persist';
import firebase from 'firebase';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/lib/integration/react';

import {initApp} from './actions/action.init';

import {StyleSheet, Text, View, Platform, StatusBar, AsyncStorage} from 'react-native';
import { createStackNavigator, createBottomTabNavigator
} from 'react-navigation';
import { firebaseConfig } from './config/auth';
import { bootstrap } from './config/bootstrap';
import { RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import NavigatorService from './utils/navigator';

import Welcome_Screen from './screens/Welcome_Screen';
import Register_Screen from './screens/Register_Screen';
import Login_Screen from './screens/Login_Screen';
import LoadingSpinner from './components/Loading/LoadingSpinner';
import Home_Screen from './screens/Home_Screen';
import Leaderboard_Screen from './screens/Leaderboard_Screen';
import Profile_Screen from './screens/Profile_Screen';
import Reset_Screen from './screens/Reset_Screen';
import Settings_Screen from './screens/Settings_Screen';
import Game_Screen from "./screens/Game_Screen";
import rootReducer from "./reducers";
import loadAssetsAsync from "./utils/loadFonts";
import {BarSearchFlatList, HamburgerIcon} from "./components";
import HamburgerNav from "./components";

const config = {
  key: 'root',
  storage: AsyncStorage
};
let reducers = persistReducer(config, rootReducer);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore(reducers, {},
      compose(applyMiddleware(thunk))
    );
    this.persistor = persistStore(store);
    bootstrap();
  }

  async componentWillMount() {
    console.log(firebaseConfig);
    await firebase.initializeApp(firebaseConfig);
    initApp();
    loadAssetsAsync();
  }

  render() {
    const MainNavigator = createBottomTabNavigator({
      menu_scr: { screen: Home_Screen },
      orders_screen: { screen: Leaderboard_Screen },
      settings_screen: { screen: Settings_Screen }
      },
      {
        navigationOptions: {
          // headerLeft: <HamburgerIcon/>,
          headerStyle: {
            backgroundColor: 'white',
            elevation: 2,
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight + 10
          },
          headerTitleStyle: {
            fontSize: RkTheme.current.fonts.sizes.h5,
            alignSelf:'center',
            marginBottom: Platform.OS === 'ios' ? 0 : 10,
            marginTop: Platform.OS === 'ios' ? 25: 0
          }
        },
        tabBarOptions: {
          showLabel: true,
          showIcon: true,
          indicatorStyle: { backgroundColor: '#ffffff' },
          activeTintColor: RkTheme.current.colors.accent,
          inactiveTintColor: RkTheme.current.colors.text.hint,
          style: { backgroundColor: '#ffffff' },
        },
        cardStyle: {
          paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
        },
        swipeEnabled: false,
        tabBarPosition: 'bottom',
      });

    const LoginNavigator = createStackNavigator({
      welcome_screen: { screen: Welcome_Screen },
      register_screen: { screen: Register_Screen },
      reset_screen: { screen: Reset_Screen },
      profile_screen: { screen: Profile_Screen },
      login_screen: { screen: Login_Screen},
      main_screen: { screen: MainNavigator},
      game_screen: { screen: Game_Screen}
      },
      {
        navigationOptions: {
          tabBarVisible: true
        },
        swipeEnabled: false,
        lazy: true
      });

      return (
        <Provider store={this.store}>
          <PersistGate loading={<LoadingSpinner/>} persistor={this.persistor}>
              <View style={styles.container}>
                {/*<HamburgerNav/>*/}
                <LoginNavigator
                    ref={navigatorRef => {
                      NavigatorService.setContainer(navigatorRef);
                    }}/>
              </View>
          </PersistGate>
        </Provider>
      );
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
}));
