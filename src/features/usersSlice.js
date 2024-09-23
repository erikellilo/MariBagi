import { createSlice } from "@reduxjs/toolkit";
import getLocalStorage from "../assets/getLocalStorage";

const initialState = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    insertNewUser: {
      prepare(userName, bagiId) {
        return {
          payload: {
            userId: new Date().getUTCMilliseconds(),
            userName: userName.toUpperCase(),
            bagiId,
          },
        };
      },
      reducer(state, action) {
        state.push(action.payload);
      },
    },
    deleteUser(state, action) {
      return state.filter((user) => user.userId !== action.payload);
    },
    editFromExistingUserBagi(state, action) {
      const localUser = getLocalStorage("user").filter(
        (user) => user.bagiId === action.payload
      );
      return localUser;
    },
  },
});

export const { insertNewUser, deleteUser, editFromExistingUserBagi } =
  usersSlice.actions;

export default usersSlice.reducer;
