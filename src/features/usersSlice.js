import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    insertNewUser: {
      prepare(userName) {
        return {
          payload: {
            userId: new Date().getUTCMilliseconds(),
            userName: userName.toUpperCase(),
            items: [],
          },
        };
      },
      reducer(state, action) {
        state.listUsers.push(action.payload);
      },
    },
    deleteUser(state, action) {
      state.listUsers = state.listUsers.filter(
        (user) => user.userId !== action.payload
      );
    },
  },
});

export const { insertNewUser, deleteUser } = usersSlice.actions;

export default usersSlice.reducer;
