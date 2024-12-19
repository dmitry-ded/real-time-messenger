import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";

const initialState = {
  idList: [] as string[],
}

const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    addId(state, action) {
      if (!state.idList.includes(action.payload)) {
        state.idList.push(action.payload);
      }
    }
  }
});


export const { addId } = chatListSlice.actions;

export const selectChatListSlice = (state: RootState) => state.chatListSlice;

export default chatListSlice.reducer;