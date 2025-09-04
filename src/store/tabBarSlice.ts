/**
 * @file tabBar选中状态的slice
 */
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface tabBarSliceType {
    value: number,
    visible: boolean
}

const initialState: tabBarSliceType = {
    value: 1,
    visible: true
}

export const tabBarSlice = createSlice({
    name: 'tabBar',
    initialState,
    reducers: {
        setTabBar: (state, action: PayloadAction<number>) => {
            state.value = action.payload
        },
        switchVisible: (state) => {
            state.visible = !state.visible
        }
    }
})

export const { setTabBar, switchVisible } = tabBarSlice.actions

export default tabBarSlice.reducer