import { ApiResponse } from "../api";

// 기본 타입 정의
type MannerId = number;
type MemberCount = number;

// 매너 키워드 관련 인터페이스
interface MannerKeyWord {
  mannerKeywordId: MannerId;
  count: MemberCount;
}

// 공통으로 사용되는 베이스 인터페이스
interface BaseMannerData {
  mannerRatingId: MannerId;
  mannerKeywordIdList: MannerId[];
}

// 사용자 매너 데이터
interface UserMannerData {
  mannerLevel: number;
  mannerRank: number;
  mannerRatingCount: MemberCount;
}

// 다른 키워드 매너 데이터
interface OtherKeywordsMannerData {
  mannerKeywords: MannerKeyWord[];
}

// 멤버 긍정/부정 매너 데이터
interface MemberPositiveNegativeMannerData extends BaseMannerData {
  targetMemberId: MannerId;
}

// Response 타입 정의
export type MannerResponse = ApiResponse<BaseMannerData>;
export type UserMannerResponse = ApiResponse<UserMannerData>;
export type OtherKeywordsMannerResponse = ApiResponse<OtherKeywordsMannerData>;
export type MemberPositiveNegativeMannerResponse =
  ApiResponse<MemberPositiveNegativeMannerData>;
