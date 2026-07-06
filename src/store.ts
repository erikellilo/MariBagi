import { configureStore, combineReducers } from "@reduxjs/toolkit";
import localStorageMiddleware from "./features/localStorageMiddleware";
import bagiReducer from "./features/bagiSlice";
import userReducer from "./features/usersSlice";
import itemReducer from "./features/itemsSlice";
import errorReducer from "./features/errorSlice";

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
