// index.js or store.js
import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./features/inputSlice";
import apiReducer from "./features/apiSlice";
import checkboxReducer from "./features/checkboxSlice";
import checkedValuesReducer from "./features/checkedValuesSlice";
import searchResultsReducer from "./features/searchResultsSlice"


const store = configureStore({
  reducer: {
    input: inputReducer,
    api: apiReducer,
    checkbox: checkboxReducer,
    checkedValues: checkedValuesReducer,
    searchResults: searchResultsReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
