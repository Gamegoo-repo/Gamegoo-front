import { BlockList } from "@/types/friend/blockList";
import { ApiResponse } from "../api";

interface GetBlockListData {
  blockedMemberList: BlockList[];
  listSize: number;
  totalPage: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
}

export type GetBlockListResponse = ApiResponse<GetBlockListData>;