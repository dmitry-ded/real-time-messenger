import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";


export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (uid: string, { rejectWithValue }) => {
    if (!uid) return rejectWithValue('No UID provided');

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {

        const userData = docSnap.data() as User;
        return userData;
      } else {
        return rejectWithValue('User not found');
      }
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  }
);

interface User {
  id: string;
  username: string;
  email: string;
  blocked: string[];
}

interface UserSliceState {
  currentUser: User | null,
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