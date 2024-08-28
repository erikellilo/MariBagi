import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  namaBagi: "",
  bagiId: 0,
  includeService: false,
  includeTax: false,
  listUsers: [],
};

export const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    insertName(state, action) {
      state.namaBagi = action.payload;
    },
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

export const { insertNewUser, insertName, deleteUser } = usersSlice.actions;

export default usersSlice.reducer;
