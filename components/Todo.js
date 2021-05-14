import React from "react";
import {Text} from 'react-native';

export const Todo = ({ id, complete, text }) => {
  return (
    <Text className={complete ? "strikethrough" : ""}>{text}</Text>
  );
};

