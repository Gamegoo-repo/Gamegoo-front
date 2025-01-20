import { MannerId } from "@/types/api/manner/manner";

export interface MannerList {
  isPositive: boolean;
  isExist: boolean;
  mannerRatingKeywordList: number[];
}

export interface MannerKeywords {
  mannerKeywordId: number;
  count: number;
}

export interface OthersManner {
  memberId: number;
  mannerLevel: number;
  mannerKeywords: MannerKeywords[];
}

export interface Mannerstatus {
  mannerRatingId: MannerId;
  mannerKeywordIdList: MannerId[];
}
