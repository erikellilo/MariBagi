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
          },
        };
      },
      reducer(state, action) {
        const listItems = state;
        const { calculateName, calculateAmount, userCalculate, isShared } =
          action.payload;
        const isExistListItem = listItems?.findIndex(
          (item) => item.calculateName === calculateName
        );
        const amountIntUser = userCalculate?.reduce(
          (acc, cur) => acc + cur.amount,
          0
        );

        listItems.push(action.payload);
      },
    },
    deleteItem(state, action) {
      state.listItems = state.listItems.filter(
        (item) => item.itemId !== action.payload
      );
    },
  },
});

export const { inserNewItem, deleteItem } = itemsSlice.actions;
export default itemsSlice.reducer;
