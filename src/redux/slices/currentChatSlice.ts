import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";

const initialState = {
  currentChat: "",
}

const currentChatSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    addCurrentChat(state, action) {
      state.currentChat = action.payload;
    }
  }
});


export const { addCurrentChat } = currentChatSlice.actions;

export const selectCurrentChatSlice = (state: RootState) => state.currentChatSlice;

export default currentChatSlice.reducer;