export interface ChatRoomList {
    chatroomId: number;
    uuid: string;
    targetMemberImg: number;
    targetMemberName: string;
    lastMsg: string;
    lastMsgAt: string;
    notReadMsgCnt: number;
}