import React from 'react';
import {
  TextInput as RNTextInput
} from 'react-native';

export const TextInput = ({ input = {}, ...props }) =>
  <RNTextInput
    underlineColorAndroid="transparent"
    {...input}
    {...props}
  />;