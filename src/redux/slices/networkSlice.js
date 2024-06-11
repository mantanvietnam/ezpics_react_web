import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  network: "https://apis.ezpics.vn/apis", // giá trị khởi tạo cho network
};

const ipv4Slice = createSlice({
  name: "ipv4",
  initialState,
  reducers: {
    setNetwork(state, action) {
      state.network = action.payload;
    },
  },
});

export const { setNetwork } = ipv4Slice.actions;

export default ipv4Slice.reducer;
