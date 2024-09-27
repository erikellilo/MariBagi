import { createSlice } from "@reduxjs/toolkit";

import getLocalStorage from "../assets/getLocalStorage";

export const itemsSlice = createSlice({
  name: "items",
  initialState: [],
  reducers: {
    inserNewItem: {
      prepare(itemsCalculate, bagiId) {
        return {
          payload: {
            itemId: Date.now(),
            ...itemsCalculate,
            bagiId: bagiId,
            userCalculate: itemsCalculate.userCalculate.filter(
              (user) => user.amount > 0
            ),
          },
        };
      },
      reducer(state, action) {
        const listItems = state;
        listItems.push(action.payload);
      },
    },
    deleteItem(state, action) {
      return state.filter((item) => item.itemId !== action.payload);
    },
    editFromExistingitemBagi(state, action) {
      const getLocalItem = getLocalStorage("item").filter(
        (item) => item.bagiId === action.payload
      );
      return getLocalItem;
    },
  },
});

export const { inserNewItem, deleteItem, editFromExistingitemBagi } =
  itemsSlice.actions;
export default itemsSlice.reducer;
