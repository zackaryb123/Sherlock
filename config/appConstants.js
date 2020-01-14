import {Platform} from 'react-native';

export class UIConstants {
  static AppbarHeight = Platform.OS === 'ios' ? 44 : 56;
  static StatusbarHeight = Platform.OS === 'ios' ? 20 : 0;
  static HeaderHeight = this.AppbarHeight + this.StatusbarHeight;
}

export class NEWS_API_URI {
  static API_KEY = 'c0b94baee8c6418cb4d2ea1b2af72445';
  static TOPHEADLINES = 'https://newsapi.org/v2/top-headlines?';
  static EVERYTHING = 'https://newsapi.org/v2/everything?'
}

/* Change value to change theme
* - THEME_TWO
* - THEME_THREE */
export const THEME = 'THEME_TWO';
export class STYLES {
  static THEME_ONE = {
    THEME_ID: 0,
    GRADIANT: ['#275EEA', '#C025FF'],

  };
  static THEME_TWO = {
    THEME_ID: 1,
    GRADIANT: ['#C7EDE6', '#f7e46c'],

  };

  static THEME_THREE = {
    THEME_ID: 2,
    GRADIANT: ['#FBCD59', '#8889b9'],

  };
}
const rectNativeVersion = 'https://github.com/expo/react-native/archive/sdk-35.0.0.tar.gz';