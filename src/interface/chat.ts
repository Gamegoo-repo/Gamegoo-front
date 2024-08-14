export interface ChatroomList {
    chatroomId: number;
    uuid: string;
    targetMemberImg: number;
    targetMemberName: string;
    lastMsg: string;
    lastMsgAt: string;
    notReadMsgCnt: number;
}

export interface SystemMessage {
    senderId: number;
    senderName: string;
    senderProfileImg: number;
    message: string;
    createdAt: string;
    timestamp: number;
    boardId: number;
}

export interface ChatMessageDto {
    senderId: number;
    senderName: string;
    senderProfileImg: number;
    message: string;
    createdAt: string;
    timestamp: number;
    boardId?: number;
}

export interface ChatMessageList {
    chatMessageDtoList: ChatMessageDto[];
    list_size: number;
    has_next: boolean;
    next_cursor: string | null;
}

export interface Chat {
    uuid: string;
    memberId: number;
    gameName: string;
    memberProfileImg: number;
    friend: boolean;
    blocked: boolean;
    system?: SystemMessage | null;
    senderId?: number;
    senderName?: string;
    senderProfileImg?: number;
    message?: string;
    createdAt?: string;
    timestamp?: number;
    chatMessageList: ChatMessageList;
}