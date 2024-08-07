export interface BoardList {
    boardId: number;
    memberId: number;
    profileImage: string;
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

export interface Post {
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