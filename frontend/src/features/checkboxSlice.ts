// checkboxSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckboxState {
  [index: number]: boolean;
}

const initialState: CheckboxState = {};

const checkboxSlice = createSlice({
  name: "checkbox",
  initialState,
  reducers: {
    toggleCheckbox: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state[index] = !state[index];
    },
  },
});

export const { toggleCheckbox } = checkboxSlice.actions;
export default checkboxSlice.reducer;
