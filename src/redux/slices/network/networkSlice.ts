import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NetworkState {
  ipv4Address: string;
}

const NetworkInitialState: NetworkState = {
  ipv4Address: "https://apis.ezpics.vn/apis",
};

export const networkSlice = createSlice({
  name: "network",
  initialState: NetworkInitialState,
  reducers: {
    setIPv4Address: (state, action: PayloadAction<string>) => {
      state.ipv4Address = action.payload;
    },
  },
});

export const { setIPv4Address } = networkSlice.actions;
// export const selectCount = (state: RootState) => state.login.loggedIn;
export default networkSlice.reducer;
