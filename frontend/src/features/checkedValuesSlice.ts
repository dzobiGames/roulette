// checkedValuesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckedValuesState {
  values: string[];
}

const initialState: CheckedValuesState = {
  values: [],
};

const checkedValuesSlice = createSlice({
  name: "checkedValues",
  initialState,
  reducers: {
    setCheckedValue: (state, action: PayloadAction<string>) => {
      // Check if the value is already in the array to avoid duplicates
      if (!state.values.includes(action.payload)) {
        state.values.push(action.payload);
      }
    },
    removeCheckedValue: (state, action: PayloadAction<string>) => {
      // Remove the value from the array
      state.values = state.values.filter((value) => value !== action.payload);
    },
  },
});

export const { setCheckedValue, removeCheckedValue } =
  checkedValuesSlice.actions;
export default checkedValuesSlice.reducer;
