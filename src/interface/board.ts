import { MannerKeywords } from "./manner";

export interface BoardList {
    boardId: number;
    memberId: number;
    profileImage: number;
    gameName: string;
    mannerLevel: number;
    tier: string;
    rank: number;
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
    isBlocked: boolean;
    isFriend: boolean;
    friendRequestMemberId: number;
    createdAt: string;
    profileImage: number;
    gameName: string;
    tag: string;
    mannerLevel: number;
    mannerKeywords: MannerKeywords[];
    tier: string;
    mike: boolean;
    championList: number[];
    gameMode: number;
    mainPosition?: number;
    subPosition?: number;
    wantPosition?: number;
    recentGameCount: number;
    winRate: number;
    gameStyles: number[];
    contents: string;
}

export interface NonMemberPost {
    boardId: number;
    memberId: number;
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
    recentGameCount: number;
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