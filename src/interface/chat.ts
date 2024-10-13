export interface ChatroomList {
    blocked: boolean;
    blind: boolean;
    chatroomId: number;
    friend: boolean;
    friendRequestMemberId: number;
    uuid: string;
    targetMemberId: number;
    targetMemberImg: number;
    targetMemberName: string;
    lastMsg: string;
    lastMsgAt: string;
    lastMsgTimestamp: number;
    notReadMsgCnt: number;
}

export interface SystemMessage {
    chatroomUuid?:string;
    senderId: number;
    senderName: null;
    senderProfileImg: null;
    message: string;
    createdAt: string;
    timestamp: number;
    systemType:number;
    boardId?: number|null;
}

export interface DesignedSystemMessage {
    senderId: number;
    senderName: string | null;
    senderProfileImg: null;
    message: string;
    createdAt: null;
    timestamp: null;
    systemType?: number;
    boardId: number;
}

export interface ChatMessageDto {
    senderId: number;
    senderName: string | null;
    senderProfileImg: number | null;
    message: string;
    createdAt: string;
    timestamp: number;
    systemType?: number;
    boardId?: number | null;
}

export interface ChatMessageList {
    chatMessageDtoList: ChatMessageDto[] | [];
    list_size: number;
    has_next: boolean;
    next_cursor: number | null;
}

interface System {
    flag: number;
    boardId: number;
}

export interface ChatContent {
    blind: boolean;
    blocked: boolean;
    chatMessageList: ChatMessageList;
    friend: boolean;
    friendRequestMemberId: number;
    gameName: string;
    memberId: number;
    memberProfileImg: number;
    system: System | null;
    uuid: string;
}

export interface Chat {
    uuid: string;
    memberId: number;
    gameName: string;
    memberProfileImg: number;
    friend: boolean;
    blocked: boolean;
    blind: boolean;
    friendRequestMemberId: number;
    system?: SystemMessage | null;
    senderId?: number;
    senderName?: string;
    senderProfileImg?: number;
    message?: string;
    createdAt?: string;
    timestamp?: number;
    chatMessageList: ChatMessageList;
}

export interface FriendsList {
    memberId: number;
    name: string;
    memberProfileImg: number;
    liked: boolean;
}

export interface UnreadResponse {
    code: string;
    isSuccess: boolean;
    message: string;
    result: string[];
}