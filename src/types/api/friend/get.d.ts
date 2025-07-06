import { ChampionList, GameStyleList } from "@/types/api/user/profile/profile";
import { FriendList } from "@/types/friend/friendList";

import { ApiResponse } from "../api";

interface GetFriendListData {
  friendInfoList: FriendList[];
  listSize: number;
}

export type GetFriendListResponse = ApiResponse<GetFriendListData>;
export type GetSearchFriendResponse = ApiResponse<FriendList[]>;
