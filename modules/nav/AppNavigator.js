import {
  SplashScreen,
  NotAuthenticatedNavigator,
  AuthenticatedNavigator
} from '../../../routes/navigators';
import { StackNavigator } from 'react-navigation';

export default StackNavigator({
  SplashScreen: { screen: SplashScreen },
  AuthScreen: { screen: NotAuthenticatedNavigator },
  AppScreen: { screen: AuthenticatedNavigator },
}, {
  headerMode: 'none'
});