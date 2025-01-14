export interface MannerList {
  isPositive: boolean;
  isExist: boolean;
  mannerRatingKeywordList: number[];
}

export interface MannerKeywords {
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
  mannerId: number | null;
  isPositive: boolean;
  isExist: boolean;
  mannerRatingKeywordList: number[];
}
