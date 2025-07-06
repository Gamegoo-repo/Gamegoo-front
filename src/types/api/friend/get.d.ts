import { ChampionList, GameStyleList } from "@/types/api/user/profile/profile";

import type { FriendList } from "@/types/friend/friendList";
import type { ApiResponse } from "../api";

interface GetFriendListData {
  friendInfoList: FriendList[];
  listSize: number;
}

export type GetFriendListResponse = ApiResponse<GetFriendListData>;
export type GetSearchFriendResponse = ApiResponse<FriendList[]>;
