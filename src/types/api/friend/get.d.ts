import { ChampionList, GameStyleList } from "@/interface/profile";
import { ApiResponse } from "../api";
import { FriendList } from "@/types/friend/friendList";

interface GetFriendListData {
  friendInfoList: FriendList[];
  listSize: number;
}

export type GetFriendListResponse = ApiResponse<GetFriendListData>;
export type GetSearchFriendResponse = ApiResponse<FriendList[]>;