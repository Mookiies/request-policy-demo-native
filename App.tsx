import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  Provider
} from "urql";
import { retryExchange } from '@urql/exchange-retry';
import { Todos } from "./components";
import gql from 'graphql-tag';
import {debugExchange} from './debugExchange';

const client = createClient({
  url: "https://example.example.com/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange,
    retryExchange({
      retryIf: () => true,
      maxNumberAttempts: 5,
      maxDelayMs: 2000,
    }),
    debugExchange({
      onIncoming: (op) => console.warn('Incoming Operation: ', op.key, op.kind),
      onCompleted: (result) => console.warn('Completed data: ', result.operation.key, result.error),
    }),
    fetchExchange,
  ],
  requestPolicy: "network-only"
});

export default function App() {
  const [showTodos, setShowTodos] = useState(false);
  const toggleTodos = () => {
    setShowTodos((previousValue) => !previousValue);
  };

  return (
    <Provider value={client}>
      <View style={styles.container}>
        <Button onPress={toggleTodos} title="Toggle todos"/>
        <Button onPress={() => makeRequest(client)} title="Fire one off request"/>
        {showTodos ? <Todos /> : null}
      </View>
    </Provider>
  );
}

const makeRequest = async (client) => {
  const { data, error } = await client
    .query(TodoQuery)
    .toPromise();

  if (error) {
    Alert.alert('Got an error');
    console.warn('Got an error', error);
  }
  if (data) {
    console.warn('Got data', data);
  }
}

const TodoQuery = gql`
  query {
    getGarbage {
      dumpster
    }
  }
`;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
