import { MannerId } from "@/types/api/manner/manner";

export interface MannerList {
  isPositive: boolean;
  isExist: boolean;
  mannerRatingKeywordList: number[];
}

export interface MannerKeywords {
  mannerKeywordId: number;
  count: number;
  createdAt: string;
  updatedAt: string;
  id: number;
  contents: string;
  positive: boolean;
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
