import { GameMode } from "@/types/game/gameMode";
import { Position } from "@/types/position/position";
import { Mike } from "@/types/user/mike";

export function setQueueType(gameMode: GameMode) {
  switch (gameMode) {
    case "FAST":
      return "빠른대전";
    case "SOLO":
      return "솔로랭크";
    case "FREE":
      return "자유랭크";
    case "ARAM":
      return "칼바람 나락";
    default:
      return "빠른대전";
  }
}

export function setCustomProfileImg(profile: number) {
  switch (profile) {
    case 1:
      return "/assets/images/profile/profile1.svg";
    case 2:
      return "/assets/images/profile/profile2.svg";
    case 3:
      return "/assets/images/profile/profile3.svg";
    case 4:
      return "/assets/images/profile/profile4.svg";
    case 5:
      return "/assets/images/profile/profile5.svg";
    case 6:
      return "/assets/images/profile/profile6.svg";
    case 7:
      return "/assets/images/profile/profile7.svg";
    case 8:
      return "/assets/images/profile/profile8.svg";
    default:
      return "/assets/images/profile/profile1.svg";
  }
}

export function setPositionImg(position: Position) {
  switch (position) {
    case "ANY":
      return "/assets/images/position/position_all.svg";
    case "TOP":
      return "/assets/images/position/position_top.svg";
    case "JUNGLE":
      return "/assets/images/position/position_jungle.svg";
    case "MID":
      return "/assets/images/position/position_mid.svg";
    case "ADC":
      return "/assets/images/position/position_one_deal.svg";
    case "SUP":
      return "/assets/images/position/position_supporter.svg";
    default:
      return "/assets/images/position/position_all.svg";
  }
}

export function setAbbrevTier(tier: string) {
  switch (tier) {
    case "IRON":
      return "I";
    case "BRONZE":
      return "B";
    case "SILVER":
      return "S";
    case "GOLD":
      return "G";
    case "PLATINUM":
      return "P";
    case "EMERALD":
      return "E";
    case "DIAMOND":
      return "D";
    case "MASTER":
      return "M";
    case "GRANDMASTER":
      return "GM";
    case "CHALLENGER":
      return "C";
    default:
      return "UR";
  }
}

export const tierStringToId = (tier: string | null) => {
  switch (tier) {
    case "IRON":
      return 1;
    case "BRONZE":
      return 2;
    case "SILVER":
      return 3;
    case "GOLD":
      return 4;
    case "PLATINUM":
      return 5;
    case "EMERALD":
      return 6;
    case "DIAMOND":
      return 7;
    case "MASTER":
      return 8;
    case "GRANDMASTER":
      return 9;
    case "CHALLENGER":
      return 10;
    default:
      return null;
  }
};

export const mikeBooleanToId = (mike: Mike | null) => {
  switch (mike) {
    case null:
      return 0;
    case "AVAILABLE":
      return 1;
    case "UNAVAILABLE":
      return 2;
    default:
      return null;
  }
};
