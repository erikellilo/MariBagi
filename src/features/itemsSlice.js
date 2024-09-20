import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemId: null,
  calculateName: "",
  calculatePrice: 0,
  calculateAmount: 0,
  isShared: false,
  userCalculate: [],
};

export const itemsSlice = createSlice({
  name: "items",
  initialState: [],
  reducers: {
    inserNewItem: {
      prepare(itemsCalculate, bagiId) {
        return {
          payload: {
            itemId: `${bagiId}_${new Date().getUTCMilliseconds()}`,
            ...itemsCalculate,
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
  },
});

export const { inserNewItem, deleteItem } = itemsSlice.actions;
export default itemsSlice.reducer;
