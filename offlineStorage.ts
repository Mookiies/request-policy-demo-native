import type {
  StorageAdapter,
  SerializedEntries,
  SerializedRequest,
} from '@urql/exchange-graphcache';

// import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorage } from 'react-native';

export interface OfflineStorage extends StorageAdapter {
  clear(): void;
}

const makeOfflineStorage = (): OfflineStorage => {
  const CACHE_NAME = `graphcache-v4-entries`;
  const METADATA_CACHE_NAME = `graphcache-v4-metadata`;

  const cache = {};

  return {
    clear(): void {
      AsyncStorage.removeItem(CACHE_NAME);
      AsyncStorage.removeItem(METADATA_CACHE_NAME);
    },
    async writeData(delta: SerializedEntries): Promise<any> {
      Object.assign(cache, delta);
      await AsyncStorage.setItem(CACHE_NAME, JSON.stringify(cache));
      return cache;
    },
    async readData(): Promise<SerializedEntries> {
      const local = await AsyncStorage.getItem(CACHE_NAME);
      local && Object.assign(cache, JSON.parse(local));
      return cache;
    },
    writeMetadata(json: SerializedRequest[]) {
      AsyncStorage.setItem(METADATA_CACHE_NAME, JSON.stringify(json));
    },
    async readMetadata(): Promise<SerializedRequest[] | null> {
      const metadataJson = await AsyncStorage.getItem(METADATA_CACHE_NAME);
      return metadataJson ? JSON.parse(metadataJson) : null;
    },
  };
};

export default makeOfflineStorage;
