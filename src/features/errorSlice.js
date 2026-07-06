import { createSlice } from "@reduxjs/toolkit";

const initialState = { form: "", message: "" };

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    addError(state, action) {
      state.form = action.payload.form;
      state.message = action.payload.message;
    },
    clearError() {
      return initialState;
    },
  },
});

export const { addError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
