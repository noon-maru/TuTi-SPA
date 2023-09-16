import { combineReducers, Reducer } from "@reduxjs/toolkit";
import userReducer, { UserState } from "./slice/userSlice";

export interface RootState {
  user: UserState;
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  user: userReducer,
});

export default rootReducer;
