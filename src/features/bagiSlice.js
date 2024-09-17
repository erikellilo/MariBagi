import { createSlice } from "@reduxjs/toolkit";
import getLocalStorage from "../assets/getLocalStorage";

const initialState = {
  namaBagi: "",
  bagiId: null,
  bagiDate: null,
  includeService: false,
  includeTax: false,
};

const populateStoreName = (state, id, name, date) => {
  if (Object.keys(state.isError).length === 0) {
    state.bagiId = id;
    state.namaBagi = name;
    state.bagiDate = date;
  }
};

const bagiSlice = createSlice({
  name: "bagi",
  initialState,
  reducers: {
    insertBagi(state, action) {
      const existingLocal = getLocalStorage();
      const isExistingLocal = existingLocal?.findIndex(
        (users) => users.bagiId === action.payload.bagiId
      );

      const isExistingName = existingLocal?.findIndex(
        (users) => users.namaBagi === action.payload.formHome
      );

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
    },
    editFromExistingBagi(state, action) {
      return action.payload;
    },
  },
});

export const { insertBagi, editFromExistingBagi } = bagiSlice.actions;
export default bagiSlice.reducer;
