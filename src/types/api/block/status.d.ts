import { ChampionList, GameStyleList } from "@/types/api/user/profile/profile";
import { FriendList } from "@/types/friend/friendList";

import { ApiResponse } from "../api";

interface BlockStatusData {
  targetMemberId: number;
  message: string;
}

export type BlockStatusResponse = ApiResponse<BlockStatusData>;
