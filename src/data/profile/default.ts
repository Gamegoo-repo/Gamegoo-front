import type { Position } from "@/types/position/position";
import type { Mike } from "@/types/user/mike";

export const DEFAULT_PROFILE = {
  profileImg: 3,
  mike: "AVAILABLE" as Mike,
  email: "",
  gameName: "GAMEGOO",
  tag: "KR1",
  soloTier: "SILVER",
  freeTier: "UNRANKED",
  soloRank: 3,
  freeRank: 0,
  updatedAt: "",
  mainP: "ANY" as Position,
  subP: "ANY" as Position,
  wantP: ["ANY", "ANY"] as Position[],
  blocked: false,
  isAgree: false,
  isBlind: false,
  loginType: "",
  soloWinrate: 0,
  freeWinrate: 0,
  gameStyleResponseList: [
    {
      gameStyleId: 3,
      gameStyleName: "이기기만 하면 뭔들",
    },
    {
      gameStyleId: 8,
      gameStyleName: "과도한 핑은 사절이에요",
    },
    {
      gameStyleId: 2,
      gameStyleName: "랭크 올리고 싶어요",
    },
  ],
  championResponseList: [
    {
      championId: 910,
      championName: "Hwei",
      csPerMinute: 0,
      games: 0,
      winRate: 0,
      wins: 0,
      kda: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
    },
    {
      championId: 777,
      championName: "Yone",
      csPerMinute: 0,
      games: 0,
      winRate: 0,
      wins: 0,
      kda: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
    },
    {
      championId: 64,
      championName: "Lee Sin",
      csPerMinute: 0,
      games: 0,
      winRate: 0,
      wins: 0,
      kda: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
    },
  ],
  memberRecentStats: {
    recTotalWins: 0,
    recTotalLosses: 0,
    recWinRate: 0,
    recAvgKDA: 0,
    recAvgCsPerMinute: 0,
    recTotalCs: 0,
  },
  friend: false,
  friendRequestMemberId: null,
};

export const DEFAULT_MANNER = {
  memberId: 0,
  mannerLevel: 4,
  mannerRank: 15,
  mannerRatingCount: 4,
  mannerKeywords: [
    {
      mannerKeywordId: 1,
      count: 0,
    },
    {
      mannerKeywordId: 2,
      count: 0,
    },
    {
      mannerKeywordId: 3,
      count: 0,
    },
    {
      mannerKeywordId: 4,
      count: 0,
    },
    {
      mannerKeywordId: 5,
      count: 0,
    },
    {
      mannerKeywordId: 6,
      count: 0,
    },
    {
      mannerKeywordId: 7,
      count: 0,
    },
    {
      mannerKeywordId: 8,
      count: 0,
    },
    {
      mannerKeywordId: 9,
      count: 0,
    },
    {
      mannerKeywordId: 10,
      count: 0,
    },
    {
      mannerKeywordId: 11,
      count: 0,
    },
    {
      mannerKeywordId: 12,
      count: 0,
    },
  ],
};
