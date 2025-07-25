import type { OtherProfileResponse } from "@generated";
import type { User } from "@/types";

export const mapOtherProfileToUser = (data: OtherProfileResponse): User => {
  return {
    id: data.id ?? 0,
    profileImg: data.profileImg ?? 1,
    mike: data.mike ?? "UNAVAILABLE",
    email: "",
    gameName: data.gameName ?? "",
    tag: data.tag ?? "",
    soloTier: data.soloTier ?? "",
    freeTier: data.freeTier ?? "",
    soloRank: data.soloRank ?? 0,
    freeRank: data.freeRank ?? 0,
    updatedAt: data.updatedAt ?? "",
    mainP: data.mainP ?? "ANY",
    subP: data.subP ?? "ANY",
    wantP: data.wantP ?? [],
    isAgree: data.isAgree ?? false,
    isBlind: data.isBlind ?? false,
    loginType: data.loginType ?? "",
    soloWinrate: data.soloWinrate ?? 0,
    freeWinrate: data.freeWinrate ?? 0,
    gameStyleResponseList:
      data.gameStyleResponseList?.map((style) => ({
        gameStyleId: style.gameStyleId ?? 0,
        gameStyleName: style.gameStyleName ?? "",
      })) ?? [],
    championResponseList:
      data.championStatsResponseList?.map((champ) => ({
        championId: champ.championId ?? 0,
        championName: champ.championName ?? "",
        winRate: champ.winRate ?? 0,
        wins: champ.wins ?? 0,
        games: champ.games ?? 0,
        csPerMinute: champ.csPerMinute ?? 0,
        averageCs: champ.averageCs ?? 0,
        kda: champ.kda ?? 0,
        kills: champ.kills ?? 0,
        deaths: champ.deaths ?? 0,
        assists: champ.assists ?? 0,
      })) ?? [],
    blocked: data.blocked ?? false,
    friend: data.friend ?? false,
    friendRequestMemberId: data.friendRequestMemberId ?? null,
  };
};
