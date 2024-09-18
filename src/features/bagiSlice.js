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
  state.bagiId = id;
  state.namaBagi = name;
  state.bagiDate = date;
};

const bagiSlice = createSlice({
  name: "bagi",
  initialState,
  reducers: {
    insertBagi(state, action) {
      const existingLocal = getLocalStorage();

      if (action.payload.isExistingLocal >= 0) {
        const existingData = existingLocal[action.payload.isExistingLocal];

        populateStoreName(
          state,
          existingData.bagiId,
          action.payload.formHome,
          existingData.bagiDate
        );
      } else {
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
