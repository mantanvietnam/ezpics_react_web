// import { rootReducer } from "@/api/gererateToServer";
// export type RootState = ReturnType<typeof rootReducer>;

// export default rootReducer;
import { combineReducers } from "@reduxjs/toolkit";
import tokenReducer from "./slices/token/reducers";
import networkReducer from "./slices/network/networkSlice";
import fontReducer from "./slices/font/fontSlice";
import typeUserReducer from "./slices/type/typeSlice";
import variableReducer from "./slices/variable/variableSlice";
import colorReducer from "./slices/color/colorSlice";
import infoReducer from "./slices/user/userSlice";
import authReducer from "./slices/auth";
import ipv4Reducer from "./slices/network/networkSlice";
const rootReducer = combineReducers({
  token: tokenReducer,
  network: networkReducer,
  newFont: fontReducer,
  typeUser: typeUserReducer,
  variable: variableReducer,
  color: colorReducer,
  user: infoReducer,
  auth: authReducer,
  ipv4: ipv4Reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
