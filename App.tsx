import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  createClient,
  dedupExchange,
  // fetchExchange,
  Provider
} from "urql";
import { fetchExchange } from './urql-with-logs/core/src';
// import { requestPolicyExchange } from "@urql/exchange-request-policy";
import { requestPolicyExchange } from "./urql-with-logs/requestPolicyExchange"; // adds console logs
import { offlineExchange } from "@urql/exchange-graphcache";
import makeOfflineStorage from './offlineStorage';
import { Todos } from "./components";

const storage = makeOfflineStorage();
const cache = offlineExchange({
  storage
});

const client = createClient({
  url: "https://0ufyz.sse.codesandbox.io",
  exchanges: [
    dedupExchange,
    requestPolicyExchange({
      ttl: 2 * 1000,
      shouldUpgrade: (operation) => {
        console.log("shouldUpgrade", operation.key);
        return true;
      }
    }),
    cache,
    fetchExchange
  ],
  // Can change this to cache-and-network and network request will not get torn down
  requestPolicy: "cache-first"
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
        {showTodos ? <Todos /> : null}
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
