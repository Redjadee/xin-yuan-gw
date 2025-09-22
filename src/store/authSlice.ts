/**
 * @file 全局登录状态
 */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"

interface authType {
  isLogged: boolean
  userId: string | null 
  token: string | null
  isLoading: boolean
  error: any | null
}

const initialState: authType = {
  isLogged: false,
  userId: null,
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
      action: PayloadAction<{ userId: string, token: string }>
    ) {
      state.isLogged = true
      state.userId = action.payload.userId
      state.token = action.payload.token
      state.isLoading = false
    },
    loginFailure(state, action: PayloadAction<any>) {
      state.isLogged = false
      state.userId = null
      state.token = null
      state.isLoading = false
      state.error = action.payload
    },
    logout(state) {
      state.isLogged = false
      state.userId = null
      state.token = null
      state.error = null
    }
  }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions

export default authSlice.reducer