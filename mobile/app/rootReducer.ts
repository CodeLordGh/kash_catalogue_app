// slices/index.ts
import { combineReducers } from 'redux';
import userReducer from "./screens/userSlice"
import actionReducer from './screens/actionSlice';
const rootReducer = combineReducers({
  user: userReducer,
  action: actionReducer
  // Add other reducers here
});

export default rootReducer;