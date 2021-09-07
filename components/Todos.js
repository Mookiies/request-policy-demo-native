import React, { useMemo } from "react";
import gql from "graphql-tag";
import { useQuery } from "urql";
import { Loading, Error, Todo } from ".";
import {Text, View} from 'react-native';

export const Todos = () => {
  const [res, executeQuery] = useQuery({ query: TodoQuery });

  const todos = useMemo(() => {
    if (res.error) {
      return <Error>{res.error.message}</Error>;
    }

    if (res.fetching || res.data === undefined) {
      return <Loading />;
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
    null {
      id
      text
      complete
    }
  }
`;
