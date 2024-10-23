// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './screens/userSlice';
import actionReducer from './screens/actionSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // Optionally, you can blacklist certain reducers from being persisted
  // blacklist: ['someReducer']
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedActionReducer = persistReducer(persistConfig, actionReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    action: persistedActionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
