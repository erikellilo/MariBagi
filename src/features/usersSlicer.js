import { createSlice } from "@reduxjs/toolkit";
import getLocalStorage from "../assets/getLocalStorage";

const initialState = {
  namaBagi: "",
  bagiId: null,
  bagiDate: null,
  includeService: false,
  includeTax: false,
  listUsers: [],
  listItems: [],
  isError: {},
  isSubmitting: false,
};

const populateStoreName = (state, id, name, date) => {
  if (Object.keys(state.isError).length === 0) {
    state.bagiId = id;
    state.namaBagi = name;
    state.bagiDate = date;
  }
};

export const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    insertName(state, action) {
      const existingLocal = getLocalStorage();
      const isExistingLocal = existingLocal?.findIndex(
        (users) => users.bagiId === action.payload.bagiId
      );

      const isExistingName = existingLocal?.findIndex(
        (users) => users.namaBagi === action.payload.formHome
      );

      state.isError = {};
      state.isSubmitting = true;

      if (state.listUsers?.length < 2)
        state.isError = {
          form: "BAGI",
          error: "Need to Insert Minimal Of 2 Users",
        };

      if (!action.payload.formHome)
        state.isError = {
          form: "BAGI",
          error: "Cannot Insert Empty String In Bagi Name",
        };

      if (isExistingLocal >= 0) {
        const existingData = existingLocal[isExistingLocal];
        if (
          isExistingName >= 0 &&
          existingLocal[isExistingName].bagiId !== action.payload.bagiId
        )
          state.isError = {
            form: "BAGI",
            error: "Cannot Insert A Same Name with different ID",
          };

        populateStoreName(
          state,
          existingData.bagiId,
          action.payload.formHome,
          existingData.bagiDate
        );
      } else {
        if (isExistingName >= 0)
          state.isError = {
            form: "BAGI",
            error: "Cannot Insert A Same Names",
          };

        populateStoreName(
          state,
          action.payload.bagiId,
          action.payload.formHome,
          Date.now()
        );
      }

      state.isSubmitting = false;
    },
    editFromExisting(state, action) {
      return action.payload;
    },
    clearError(state) {
      state.isError = {};
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
  editFromExisting,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer;
