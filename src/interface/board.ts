export interface BoardList {
    boardId: number;
    memberId: number;
    profileImage: number;
    gameName: string;
    mannerLevel: number;
    tier: string;
    gameMode: number;
    mainPosition: number;
    subPosition: number;
    wantPosition: number;
    championList: number[];
    winRate: number;
    createdAt: string;
}

export interface MemberPost {
    boardId: number;
    memberId: number;
    isBlocked:boolean;
    createdAt: string;
    profileImage: number;
    gameName: string;
    tag: string;
    mannerLevel: number;
    tier: string;
    mike: boolean;
    championList: number[];
    gameMode: number;
    mainPosition?: number;
    subPosition?: number;
    wantPosition?: number;
    winRate: number;
    gameStyles: number[];
    contents: string;
    recentGameCount:number;
}

export interface NonMemberPost {
    boardId: number;
    memberId: number;
    createdAt: string;
    profileImage: string;
    gameName: string;
    tag: string;
    mannerLevel: number;
    tier: string;
    voice: boolean;
    championList: number[];
    gameMode: number;
    mainPosition?: number;
    subPosition?: number;
    wantPosition?: number;
    winRate: number;
    gameStyles: number[];
    contents: string;
}

export interface PostReq {
    boardProfileImage: number;
    gameMode: number;
    mainPosition: number;
    subPosition: number;
    wantPosition: number;
    mike: boolean;
    gameStyles: number[];
    contents: string;
}