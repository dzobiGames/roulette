// // responseDataSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface ResponseData {
//   [key: number]: number;
// }

// const searchResultsSlice = createSlice({
//   name: "searchResults",
//   initialState: null as ResponseData | null,
//   reducers: {
//     setSearchResultsData: (_, action: PayloadAction<ResponseData>) => {
//       return action.payload;
//     },
//     clearSearchResultsData: (_) => {
//       return null;
//     },
//   },
// });

// export const { setSearchResultsData, clearSearchResultsData } =
//   searchResultsSlice.actions;
// export default searchResultsSlice.reducer;



// responseDataSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of each search result item
interface SearchResult {
  key: string;
  value: number;
}

// Define the shape of the state, which is an array of SearchResult items
type ResponseData = SearchResult[];

const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState: [] as ResponseData, // Initialize with an empty array
  reducers: {
    setSearchResultsData: (_, action: PayloadAction<ResponseData>) => {
      return action.payload;
    },
    clearSearchResultsData: (_) => {
      return []; // Clear the search results by returning an empty array
    },
  },
});

export const { setSearchResultsData, clearSearchResultsData } =
  searchResultsSlice.actions;
export default searchResultsSlice.reducer;
