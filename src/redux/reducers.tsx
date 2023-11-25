import { combineReducers, Reducer } from "@reduxjs/toolkit";
import userReducer, { UserState } from "./slice/userSlice";
import placesReducer, { PlacesState } from "./slice/placesSlice";

export interface RootState {
  user: UserState;
  places: PlacesState;
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  user: userReducer,
  places: placesReducer,
});

export default rootReducer;
