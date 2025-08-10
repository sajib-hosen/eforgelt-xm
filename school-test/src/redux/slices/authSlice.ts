import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserResponse } from "../../api/user/get-me";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: UserResponse | null; // Replace 'any' with a proper user type
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: any }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },

    logoutSuccess(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
    },

    refreshTokenSuccess(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
  },
});

export const { loginSuccess, logoutSuccess, refreshTokenSuccess } =
  authSlice.actions;
export default authSlice.reducer;
