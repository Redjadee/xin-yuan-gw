/**
 * @file 全局登录状态
 */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"
import { userInforType } from "../../types/authType"

interface authType {
  isLogged: boolean
  user: userInforType | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: authType = {
  isLogged: false,
  user: null,
  token: null,
  isLoading: false,
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true
      state.error = null
    },
    loginSuccess(
      state,
      action: PayloadAction<{ user: userInforType, token: string }>
    ) {
      state.isLogged = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoading = false
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLogged = false
      state.user = null
      state.token = null
      state.isLoading = false
      state.error = action.payload
    },
    logout(state) {
      state.isLogged = false
      state.user = null
      state.token = null
      state.error = null
    }
  }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions

export default authSlice.reducer