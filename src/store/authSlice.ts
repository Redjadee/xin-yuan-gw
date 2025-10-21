/**
 * @file 全局登录状态
 */
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "."

interface authType {
  isLogged: boolean
  isVerified: boolean
  token: string | null
}

const initialState: authType = {
  isLogged: false,
  isVerified: false,
  token: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ token: string }>
    ) {
      state.isLogged = true
      state.isVerified = false
      state.token = action.payload.token
    },
    verifySuccess(state) {
      state.isLogged = true
      state.isVerified = true
      state.token = state.token
    },
    loginFailure(state) {
      state.isLogged = false
      state.isVerified = false
      state.token = null
    },
    logout(state) {
      state.isLogged = false
      state.isVerified = false
      state.token = null
    }
  }
})

export const { loginSuccess, verifySuccess, loginFailure, logout } = authSlice.actions

export const selectToken = (state: RootState) => state.auth.token
export const selectLogged = (state: RootState) => state.auth.isLogged
export const selectVerify = (state: RootState) => state.auth.isVerified

export default authSlice.reducer