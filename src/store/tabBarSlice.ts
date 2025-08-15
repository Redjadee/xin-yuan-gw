//tabBar选中状态的slice
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface tabBarSliceType {
    value: number
}

const initialState: tabBarSliceType = {
    value: 1
}

export const tabBarSlice = createSlice({
    name: 'tabBar',
    initialState,
    reducers: {
        setTabBar: (state, action: PayloadAction<number>) => {
            state.value = action.payload
        }
    }
})

export const { setTabBar } = tabBarSlice.actions

export default tabBarSlice.reducer