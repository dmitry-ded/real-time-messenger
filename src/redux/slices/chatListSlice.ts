import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store";

const initialState = {
  idList: [] as string[],
  usernameList: [] as string[],
}

const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    addIdChat(state, action: PayloadAction<string>) {
      if (!state.idList.includes(action.payload)) {
        state.idList.push(action.payload);
      }
    },
    addName(state, action: PayloadAction<string>) {
      if (!state.usernameList.includes(action.payload)) {
        state.usernameList.push(action.payload);
      }
    }
  }
});


export const { addIdChat, addName } = chatListSlice.actions;

export const selectChatListSlice = (state: RootState) => state.chatListSlice;

export default chatListSlice.reducer;