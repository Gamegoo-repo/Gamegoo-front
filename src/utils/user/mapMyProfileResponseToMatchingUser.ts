import type { MyProfileResponse } from "@/@generated/types";
import type { GameMode } from "@/types";
import type { MatchingUser } from "@/types/user/matching";


export const mapMyProfileResponseToMatchingUser = (
  data: MyProfileResponse & { mannerLevel: number; gameMode: GameMode }
): MatchingUser => {
  return {
    memberId: data.id ?? 0,
    gameName: data.gameName ?? "",
    tag: data.tag ?? "",
    soloTier: data.soloTier ?? "",
    freeTier: data.freeTier ?? "",
    soloRank: data.soloRank ?? 0,
    freeRank: data.freeRank ?? 0,
    mannerLevel: 0,
    profileImg: data.profileImg ?? 1,
    gameMode: "SOLO",
    mainP: data.mainP ?? "ANY",
    subP: data.subP ?? "ANY",
    wantP: data.wantP ?? [],
    mike: data.mike ?? "UNAVAILABLE",
    gameStyleList:
      data.gameStyleResponseList?.map((style) => style.gameStyleName ?? "") ??
      [],
  };
};