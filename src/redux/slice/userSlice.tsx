import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  // 사용자 상태 타입 정의
  id: string;
  username: string;
  profile: string;
  isAdmin: boolean;
}

const initialState: UserState = {
  id: "",
  username: "",
  profile: "",
  isAdmin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => action.payload,
    logout: () => initialState,
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
