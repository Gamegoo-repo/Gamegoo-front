interface ChampionResponseDTOList {
  championId: number;
  championName: string;
}

export interface PostsResponse {
  status: number;
  message: string;
  code: string;
  data: {
    boardId: number;
    memberId: number;
    profileImage: number;
    gameName: string;
    tag: string;
    tier: string;
    rank: number;
    gameMode: number;
    mainPosition: number;
    subPosition: number;
    wantPosition: number;
    mike: true;
    gameStyles: Array<number>;
    contents: string;
  };
}

export interface GetBoardListResponse {
  status: number;
  message: string;
  code: string;
  data: {
    totalPage: number;
    totalCount: number;
    boards: [
      {
        boardId: number;
        memberId: number;
        profileImage: number;
        gameName: string;
        tag: string;
        mannerLevel: number;
        tier: string;
        rank: number;
        gameMode: number;
        mainPosition: number;
        subPosition: number;
        wantPosition: number;
        championResponseList: [
          {
            championId: number;
            championName: string;
          }
        ];
        winRate: number;
        createdAt: string;
        mike: boolean;
      }
    ];
  };
}

export interface MemberPostBoardResponse {
  status: number;
  message: string;
  code: string;
  data: {
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
    mannerKeywords: [
      {
        createdAt: string;
        updatedAt: string;
        id: number;
        contents: string;
        positive: boolean;
      }
    ];
    tier: string;
    rank: number | undefined;
    mike: boolean;
    championResponseDTOList: [
      {
        championId: number;
        championName: string;
      }
    ];
    gameMode: number;
    mainPosition: number;
    subPosition: number;
    wantPosition: number;
    recentGameCount: number;
    winRate: number;
    gameStyles: Array<number>;
    contents: string;
  };
}

export interface NotMemberBoardResponse {
  status: number;
  message: string;
  code: string;
  data: {
    boardId: number;
    memberId: number;
    createdAt: string;
    profileImage: number;
    gameName: string;
    tag: string;
    mannerLevel: number;
    tier: string;
    rank: number | undefined;
    mike: boolean;
    championResponseList: ChampionResponseDTOList[];
    gameMode: number;
    mainPosition: number;
    subPosition: number;
    wantPosition: number;
    recentGameCount: number;
    winRate: number;
    gameStyles: Array<number>;
    contents: string;
  };
}

export interface BoardEditResponse {
  status: number;
  message: string;
  code: string;
  data: {
    boardId: number;
    memberId: number;
    profileImage: number;
    gameName: string;
    tag: string;
    tier: string;
    rank: number;
    gameMode: number;
    mainPosition: number;
    subPosition: number;
    wantPosition: number;
    mike: boolean;
    gameStyles: Array<number>;
    contents: string;
  };
}

export interface BoardDeleteResponse {
  status: number;
  message: string;
  code: string;
  data: string;
}
