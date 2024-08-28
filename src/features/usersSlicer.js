import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  namaBagi: "",
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
            userName,
            items: [],
          },
        };
      },
      reducer(state, action) {
        state.listUsers.push(action.payload);
      },
    },
  },
});

export const { insertNewUser } = usersSlice.actions;

export default usersSlice.reducer;
