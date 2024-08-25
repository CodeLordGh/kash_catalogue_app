// slices/index.ts
import { combineReducers } from 'redux';
import userReducer from "./screens/userSlice"
const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here
});

export default rootReducer;