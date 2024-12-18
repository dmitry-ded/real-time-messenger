import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { UserState } from "./chatSlice";


export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (uid: string, { rejectWithValue }) => {
    
    if (!uid) return rejectWithValue('No UID provided');

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {

        const userData = docSnap.data() as UserState;
        return userData;
      } else {
        return rejectWithValue('User not found');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        return rejectWithValue(err.message);

      } else {

        console.error('unknown error', err);
        return rejectWithValue('unknown error');
      }
    }
  }
);

interface UserSliceState {
  currentUser: UserState | null,
  isLoading: boolean,
  error: string | null | {},
}


const initialState: UserSliceState = {
  currentUser: null,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    removeUser(state) {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.currentUser = null;
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user info';
      });
  },
})


export const { removeUser } = userSlice.actions;

export const selectUserSlice = (state: RootState) => state.userSlice;

export default userSlice.reducer;