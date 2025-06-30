import { ChampionList, GameStyleList } from "@/interface/profile";
import { ApiResponse } from "../api";
import { FriendList } from "@/types/friend/friendList";

interface BlockStatusData {
  targetMemberId: number;
  message: string;
}

export type BlockStatusResponse = ApiResponse<BlockStatusData>;
