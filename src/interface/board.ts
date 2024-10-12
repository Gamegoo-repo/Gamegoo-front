import { MannerKeywords } from "./manner";

export interface ChampionResponseDTOList {
    championId: number;
    championName: string;
}

export interface gameStyleResponseDTOList {
    gameStyleId: number;
    gameStyleName: string;
}

export interface BoardDetail {
    boardId: number;
    memberId: number;
    profileImage: number;
    gameName: string;
    mannerLevel: number
    tier: string;
    rank: number;
    gameMode: number;
    mainPosition: number;
    subPosition: number,
    wantPosition: number,
    championResponseDTOList: ChampionResponseDTOList[],
    winRate: number,
    createdAt: string,
    mike: boolean
}

export interface BoardList {
    totalPage: number;
    totalCount: number;
    boards: BoardDetail[];
}

export interface MemberPost {
    boardId: number;
    memberId: number;
    isBlocked?: boolean;
    isFriend?: boolean;
    friendRequestMemberId?: number;
    createdAt: string;
    profileImage: number;
    gameName: string;
    tag: string;
    mannerLevel: number;
    mannerKeywords?: MannerKeywords[];
    tier: string;
    mike: boolean;
    championResponseDTOList: ChampionResponseDTOList[];
    gameMode: number;
    mainPosition?: number;
    subPosition?: number;
    wantPosition?: number;
    recentGameCount: number;
    winRate: number;
    // gameStyles: gameStyleResponseDTOList[] | number[];
    gameStyles: number[];
    contents: string;
    rank: number;
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