/* @flow */

import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';

import TouchableItem from 'react-navigation/src/views/TouchableItem';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
  NavigationRoute,
  Style,
} from 'react-navigation/src/TypeDefinition';
import type { DrawerScene, DrawerItem } from 'react-navigation/src/views/Drawer/DrawerView';

type Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  items: Array<NavigationRoute>,
  activeItemKey?: string,
  activeTintColor?: string,
  activeBackgroundColor?: string,
  inactiveTintColor?: string,
  inactiveBackgroundColor?: string,
  getLabel: (scene: DrawerScene) => ?(React.Element<*> | string),
  renderIcon: (scene: DrawerScene) => ?React.Element<*>,
  onItemPress: (info: DrawerItem) => void,
  style?: Style,
  labelStyle?: Style,
};

export const DrawerRowItem = ({ route, index, icon, label,
                                activeItemKey,
                                activeTintColor,
                                activeBackgroundColor,
                                inactiveTintColor,
                                inactiveBackgroundColor,
                                getLabel,
                                renderIcon,
                                onItemPress,
                                labelStyle
}) => {
  const focused = activeItemKey === route.key;
  const color = focused ? activeTintColor : inactiveTintColor;
  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;
  const scene = { route, index, focused, tintColor: color };
  const renderedIcon = icon === undefined ? renderIcon(scene) : icon;
  const renderedLabel = label || getLabel(scene);
  return (
    <TouchableItem
      key={route.key}
      onPress={() => {
        onItemPress({ route, focused });
      }}
      delayPressIn={0}
    >
      <View style={[styles.item, { backgroundColor }]}>
        {renderedIcon
          ? <View
            style={[styles.icon, focused ? null : styles.inactiveIcon]}
          >
            {renderedIcon}
          </View>
          : null}
        {typeof renderedLabel === 'string'
          ? <Text style={[styles.label, { color }, labelStyle]}>
            {renderedLabel}
          </Text>
          : renderedLabel}
      </View>
    </TouchableItem>
  );
}

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = ({
                                navigation: { state, navigate },
                                items,
                                activeItemKey,
                                activeTintColor,
                                activeBackgroundColor,
                                inactiveTintColor,
                                inactiveBackgroundColor,
                                getLabel,
                                renderIcon,
                                onItemPress,
                                style,
                                labelStyle,
                                children
                              }: Props) => (
  <View style={[styles.container, style]}>
    {children}
  </View>
);

/* Material design specs - https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-specs */
DrawerNavigatorItems.defaultProps = {
  activeTintColor: '#2196f3',
  activeBackgroundColor: 'rgba(0, 0, 0, .04)',
  inactiveTintColor: 'rgba(0, 0, 0, .87)',
  inactiveBackgroundColor: 'transparent',
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  inactiveIcon: {
    /*
     * Icons have 0.54 opacity according to guidelines
     * 100/87 * 54 ~= 62
     */
    opacity: 0.62,
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
  },
});

export default DrawerNavigatorItems;

