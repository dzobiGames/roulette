// inputSlice.js
import { createSlice } from "@reduxjs/toolkit";

const inputSlice = createSlice({
  name: "input",
  initialState: Array(22).fill(""), // Initial state with 22 empty strings
  reducers: {
    setInputValue: (state, action) => {
      const { index, value } = action.payload;
      state[index] = value;
    },
  },
});

export const { setInputValue } = inputSlice.actions;
export default inputSlice.reducer;
