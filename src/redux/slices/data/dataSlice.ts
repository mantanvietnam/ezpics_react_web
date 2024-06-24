import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataRender {
  data: object;
}

const DataInitialState: DataRender = {
  data: {},
};

export const renderSlice = createSlice({
  name: "render",
  initialState: DataInitialState,
  reducers: {
    CHANGING_DATA: (state, action: PayloadAction<string>) => {
      // state.data.push(action.payload);
    },
  },
});

export const { CHANGING_DATA } = renderSlice.actions;
// export const selectCount = (state: RootState) => state.login.loggedIn;
export default renderSlice.reducer;
