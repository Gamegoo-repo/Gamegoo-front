import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  isChatOpen: boolean;
  isChatRoomOpen: boolean;
  isChatRoomUuid: string | number;
  activeTab: number; // 친구 목록, 채팅방
  chatEnterType: number | null;
  memberId: number;
  onlineFriends: number[];
  unreadUuids: string[];
  currentChatUuid: string | null;
  errorMessage: string | null;
}

const initialState: ChatState = {
  isChatOpen: false,
  isChatRoomOpen: false,
  isChatRoomUuid: 0 || "",
  activeTab: 0,
  chatEnterType: null,
  memberId: 0,
  onlineFriends: [],
  currentChatUuid: null,
  unreadUuids: [],
  errorMessage: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat(state) {
      state.isChatOpen = true;
    },
    closeChat(state) {
      state.isChatOpen = false;
    },
    toggleChat(state) {
      state.isChatOpen = !state.isChatOpen;
    },
    openChatRoom(state) {
      state.isChatRoomOpen = true;
    },
    closeChatRoom(state) {
      state.isChatRoomOpen = false;
    },
    setActiveTab(state, action: PayloadAction<number>) {
      state.activeTab = action.payload;
    },
    setChatRoomUuid(state, action: PayloadAction<string | number>) {
      state.isChatRoomUuid = action.payload;
    },
    setChatEnterType(state, action: PayloadAction<number | null>) {
      state.chatEnterType = action.payload;
    },
    setMemberId(state, action: PayloadAction<number>) {
      state.memberId = action.payload;
    },
    setFriendOnline(state, action: PayloadAction<number | number[]>) {
      if (Array.isArray(action.payload)) {
        // 배열인 경우 전체를 업데이트
        state.onlineFriends = action.payload;
      } else {
        // 개별 온라인 친구 id 추가
        if (!state.onlineFriends.includes(action.payload)) {
          state.onlineFriends.push(action.payload);
        }
      }
    },
    setFriendOffline(state, action: PayloadAction<number>) {
      // id를 배열에서 제거
      state.onlineFriends = state.onlineFriends.filter(
        (id) => id !== action.payload
      );
    },
    setCurrentChatUuid(state, action: PayloadAction<string>) {
      state.currentChatUuid = action.payload;
    },
    setUnreadUuid(state, action: PayloadAction<string[]>) {
      state.unreadUuids = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
  },
});

export const {
  openChat,
  closeChat,
  toggleChat,
  openChatRoom,
  closeChatRoom,
  setActiveTab,
  setChatRoomUuid,
  setChatEnterType,
  setMemberId,
  setFriendOnline,
  setFriendOffline,
  setUnreadUuid,
  setCurrentChatUuid,
  setErrorMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
