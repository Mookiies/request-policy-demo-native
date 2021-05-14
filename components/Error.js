import React from "react";
import {Text} from 'react-native';

export const Error = props => (
  <>
    <Text>Error</Text>
    <Text>Something went wrong</Text>
    <Text>Message: {props.children}</Text>
  </>
);

// Error.displayName = "Error";
