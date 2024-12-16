import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";

export interface UserState {
  id: string,
  email: string,
  blocked: [],
  username: string,
}

interface ChatSliceState {
  chatId: string,
  user: UserState,
  isCurrentUserBlocked: boolean,
  isReceiverBlocked: boolean,
}

export const initialUserState: UserState = {
  id: "",
  email: "",
  blocked: [],
  username: ""
}

const initialState: ChatSliceState = {
  chatId: "",
  user: initialUserState,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    chageChat(state, action) {
      const { chatId, user, currentUser } = action.payload;

      if(user.blocked.includes(currentUser.id)) {
        
        // Если текущий пользователь заблокирован
        state.chatId = chatId;
        state.user = initialUserState;
        state.isCurrentUserBlocked = true;
        state.isReceiverBlocked = false;
      }
      else if (currentUser.blocked.includes(user.id)) {
        
        // Если собеседник заблокирован
        state.chatId = chatId;
        state.user = user;
        state.isCurrentUserBlocked = false;
        state.isReceiverBlocked = true;
      }
      else {
        
        // Если блокировок нет
        state.chatId = chatId;
        state.user = user;
        state.isCurrentUserBlocked = false;
        state.isReceiverBlocked = false;
      }
    },
    changeBlock(state) {
      // Переключение состояния блокировки собеседника
      state.isReceiverBlocked = !state.isReceiverBlocked;
    }, 
    resetChat: (state) => {
      // Сброс состояния чата
      state.chatId = "";
      state.user = initialUserState;
      state.isCurrentUserBlocked = false;
      state.isReceiverBlocked = false;
    },
  }
})


export const { chageChat, changeBlock, resetChat } = chatSlice.actions;

export const selectChatSlice = (state: RootState) => state.chatSlice;

export default chatSlice.reducer;