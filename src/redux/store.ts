import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from "react-redux"
import userSlice from './slices/userSlice';
import chatSlice from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    userSlice,
    chatSlice,
  },
})


export type RootState = ReturnType<typeof store.getState>

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();