export interface MannerList {
    isPositive: boolean;
    isExist: boolean;
    mannerRatingKeywordList: number[];
}

export interface MannerKeywords {
    isPositive: boolean;
    mannerKeywordId: number;
    count: number;
}

export interface OthersManner {
    memberId: number;
    mannerLevel: number;
    mannerKeywords: MannerKeywords[];
}