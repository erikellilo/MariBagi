import { configureStore, combineReducers } from "@reduxjs/toolkit";
import localStorageMiddleware from "./features/localStorageMiddleware";
import bagiReducer from "../src/features/bagiSlice";
import userReducer from "../src/features/usersSlice";
import itemReducer from "../src/features/itemsSlice";
import errorReducer from "../src/features/errorSlice";

export const rootReducer = combineReducers({
  bagi: bagiReducer,
  user: userReducer,
  item: itemReducer,
  error: errorReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(localStorageMiddleware.middleware),
});
