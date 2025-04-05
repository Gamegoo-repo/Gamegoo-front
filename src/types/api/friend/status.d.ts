import { ChampionList, GameStyleList } from "@/interface/profile";
import { ApiResponse } from "../api";
import { FriendList } from "@/types/friend/friendList";

interface FriendStatusData {
  friendMemberId: number;
  message: string;
}

export type FriendStatusResponse = ApiResponse<FriendStatusData>;