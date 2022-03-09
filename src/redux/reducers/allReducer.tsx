import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './modeReducer';
import { userReducer } from './userReducer';
const store = configureStore({
    reducer: {
      mode: modeReducer,
      user:userReducer
    },
})
export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch