import { ChampionList, GameStyleList } from "@/types/api/user/profile/profile";
import { ApiResponse } from "../api";
import { FriendList } from "@/types/friend/friendList";

interface GetFriendListData {
  friendInfoList: FriendList[];
  listSize: number;
}

export type GetFriendListResponse = ApiResponse<GetFriendListData>;
export type GetSearchFriendResponse = ApiResponse<FriendList[]>;
