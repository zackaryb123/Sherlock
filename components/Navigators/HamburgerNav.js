import {
  // createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';
import Game_Screen from "../../screens/Game_Screen";
// import BlueScreen from './BlueScreen';
// import DefaultScreen from './DefaultScreen';
const HamburgerNavigation = createDrawerNavigator(
  {
    // BlueScreen: BlueScreen,
    DefaultScreen: {
      screen: Game_Screen,
    }
  },
  {
    initialRouteName: '',


}
);
export default (HamburgerNavigation);