/**
 * @file 全局登录状态
 */
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "."

interface authType {
  isLogged: boolean
  token: string | null
}

const initialState: authType = {
  isLogged: false,
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
      state.token = action.payload.token
    },
    loginFailure(state) {
      state.isLogged = false
      state.token = null
    },
    logout(state) {
      state.isLogged = false
      state.token = null
    }
  }
})

export const { loginSuccess, loginFailure, logout } = authSlice.actions

export const selectToken = (state: RootState) => state.auth.token
export const selectLogged = (state: RootState) => state.auth.isLogged

export default authSlice.reducer