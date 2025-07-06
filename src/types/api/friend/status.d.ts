import { ChampionList, GameStyleList } from "@/types/api/user/profile/profile";
import { FriendList } from "@/types/friend/friendList";

import { ApiResponse } from "../api";

interface FriendStatusData {
  friendMemberId: number;
  message: string;
}

export type FriendStatusResponse = ApiResponse<FriendStatusData>;
