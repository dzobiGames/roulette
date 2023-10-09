// apiSlice.js
import { createSlice } from "@reduxjs/toolkit";



const apiSlice = createSlice({
  name: "api",
  initialState: { responseData: null, error: null },
  reducers: {
    setResponseData: (state, action) => {
      state.responseData = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setResponseData, setError, clearError } = apiSlice.actions;
export default apiSlice.reducer;
