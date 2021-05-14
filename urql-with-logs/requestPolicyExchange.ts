import {
  makeOperation,
  Operation,
  OperationResult,
  Exchange,
} from '@urql/core';
import { pipe, tap, map } from 'wonka';

const defaultTTL = 5 * 60 * 1000;

export interface Options {
  shouldUpgrade?: (op: Operation) => boolean;
  ttl?: number;
}

export const requestPolicyExchange = (options: Options): Exchange => ({
                                                                        forward,
                                                                      }) => {
  const operations = new Map();
  const TTL = (options || {}).ttl || defaultTTL;

  const processIncomingOperation = (operation: Operation): Operation => {
    console.warn(`processIncomingOperation: key: ${operation.key}, policy: ${operation.context.requestPolicy}, kind: ${operation.kind}`);
    if (
      operation.kind !== 'query' ||
      (operation.context.requestPolicy !== 'cache-first' &&
        operation.context.requestPolicy !== 'cache-only')
    ) {
      // console.warn('not upgrading', operation.context.requestPolicy, operation.kind);
      return operation;
    }

    const currentTime = new Date().getTime();
    const lastOccurrence = operations.get(operation.key) || 0;
    if (
      currentTime - lastOccurrence > TTL &&
      (!options.shouldUpgrade || options.shouldUpgrade(operation))
    ) {
      // console.warn('upgrading', operation.context.requestPolicy, operation.kind);
      return makeOperation(operation.kind, operation, {
        ...operation.context,
        requestPolicy: 'cache-and-network',
      });
    }

    return operation;
  };

  const processIncomingResults = (result: OperationResult): void => {
    const meta = result.operation.context.meta;
    const isMiss =
      !operations.has(result.operation.key) ||
      !meta ||
      meta.cacheOutcome === 'miss';
    const { operation } = result;
    console.warn(`processIncomingResults: key: ${operation.key}, policy: ${operation.context.requestPolicy}, kind: ${operation.kind}`);

    if (isMiss) {
      operations.set(result.operation.key, new Date().getTime());
    }
  };

  return ops$ => {
    return pipe(
      forward(pipe(ops$, map(processIncomingOperation))),
      tap(processIncomingResults)
    );
  };
};
