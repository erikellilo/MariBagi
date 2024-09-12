import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../src/features/usersSlicer";
import localStorageMiddleware from "./features/localStorageMiddleware";

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(localStorageMiddleware.middleware),
});
