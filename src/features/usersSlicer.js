import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  namaBagi: "",
  bagiId: null,
  includeService: false,
  includeTax: false,
  listUsers: [],
  listItems: [],
};

export const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    insertName(state, action) {
      state.namaBagi = action.payload.formHome;
      state.bagiId = action.payload.bagiId;
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
    inserNewItem: {
      prepare(itemsCalculate, bagiId) {
        return {
          payload: {
            itemId: `${bagiId}_${new Date().getUTCMilliseconds()}`,
            ...itemsCalculate,
          },
        };
      },
      reducer(state, action) {
        state.listItems.push(action.payload);
      },
    },
    deleteItem(state, action) {
      state.listItems = state.listItems.filter(
        (item) => item.itemId !== action.payload
      );
    },
  },
});

export const {
  insertNewUser,
  insertName,
  deleteUser,
  inserNewItem,
  deleteItem,
} = usersSlice.actions;

export default usersSlice.reducer;
