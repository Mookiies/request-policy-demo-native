import React, { useCallback, useMemo } from "react";
import gql from "graphql-tag";
import { useQuery } from "urql";
import { Loading, Error, Todo } from ".";
import {Text, View} from 'react-native';

export const Todos = () => {
  const [res, executeQuery] = useQuery({ query: TodoQuery });
  const { operation } = res;
  console.warn(`useQuery results: key: ${operation?.key}, policy: ${operation?.context.requestPolicy}, kind: ${operation?.kind}, cache status: ${operation?.context.meta?.cacheOutcome}`);

  const todos = useMemo(() => {
    if (res.fetching || res.data === undefined) {
      return <Loading />;
    }

    if (res.error) {
      return <Error>{res.error.message}</Error>;
    }

    return (
      <View>
        {res.data.todos.map((todo) => (
          <Todo key={todo.id} {...todo} />
        ))}
      </View>
    );
  }, [res]);

  return (
    <>
      <Text>Todos</Text>
      {todos}
    </>
  );
};

const TodoQuery = gql`
  query {
    todos {
      id
      text
      complete
    }
  }
`;
