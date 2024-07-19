// import { rootReducer } from "@/api/gererateToServer";
// export type RootState = ReturnType<typeof rootReducer>;

// export default rootReducer;
import { combineReducers } from "@reduxjs/toolkit";
import tokenReducer from "./slices/token/reducers";
import networkReducer from "./slices/network/networkSlice";
import typeUserReducer from "./slices/type/typeSlice";
import variableReducer from "./slices/variable/variableSlice";
import colorReducer from "./slices/color/colorSlice";
import infoReducer from "./slices/user/userSlice";
import authReducer from "./slices/auth";
import ipv4Reducer from "./slices/network/networkSlice";
import stageReducer from "./slices/editor/stageSlice"
const rootReducer = combineReducers({
  token: tokenReducer,
  network: networkReducer,
  typeUser: typeUserReducer,
  variable: variableReducer,
  color: colorReducer,
  user: infoReducer,
  auth: authReducer,
  ipv4: ipv4Reducer,
  stage: stageReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
