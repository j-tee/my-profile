import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import experienceReducer from './slices/experienceSlice';
import projectReducer from './slices/projectSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    experience: experienceReducer,
    project: projectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
