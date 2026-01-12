import { configureStore } from '@reduxjs/toolkit';
import projectsReducer, { localStorageMiddleware } from './slices/projectsSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});