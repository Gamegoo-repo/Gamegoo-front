import type { BlockList } from "@/types/friend/blockList";
import type { ApiResponse } from "../api";

interface GetBlockListData {
  blockedMemberList: BlockList[];
  listSize: number;
  totalPage: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
}

export type GetBlockListResponse = ApiResponse<GetBlockListData>;
