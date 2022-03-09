import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './allReducer';
interface modeState {
  mode: 'dark' | 'light'
}
const getMode: () => 'dark' | 'light' = () => {
  if (localStorage.getItem('MODE') === 'light') {
    localStorage.setItem('MODE','light')
    return 'light';
  }
  localStorage.setItem('MODE','dark')
  return 'dark';
}
const initialState: modeState = {
  mode: getMode()
}

export const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    change: (state) => {
      
      if (state.mode === 'dark') {
        state.mode = 'light';
        localStorage.setItem('MODE','light')
      }
      else {
        state.mode = 'dark';
        localStorage.setItem('MODE','dark')
      }
    }
  }
})
export const { change } = modeSlice.actions//actions
export default modeSlice.reducer//reducers

export const mode = (state: RootState) => state.mode
export type modeType=typeof initialState.mode