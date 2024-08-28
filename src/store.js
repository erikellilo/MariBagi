import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../src/features/usersSlicer";

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});
