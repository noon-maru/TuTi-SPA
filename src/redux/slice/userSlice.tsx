import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  // 사용자 상태 타입 정의
  id: string;
  username: string;
  profile: string;
}

const UserInitialState: UserState = {
  id: "",
  username: "",
  profile: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: UserInitialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => action.payload,
    logout: () => UserInitialState,
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
