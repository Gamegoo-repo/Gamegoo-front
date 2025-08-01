import React, { Children } from "react";

import { ChampionCell } from "./cells/ChampionCell";
import { ContentCell } from "./cells/ContentCell";
import { MannerLevelCell } from "./cells/MannerLevelCell";
import { MoreCell } from "./cells/MoreCell";
import { PositionCell } from "./cells/PositionCell";
import ProfileCell from "./cells/ProfileCell";
import { TierCell } from "./cells/TierCell";
import { WantPositionCell } from "./cells/WantPositionCell";
import { WinRateCell } from "./cells/WinRateCell";

import type { MutableRefObject, ReactNode } from "react";
import type { BoardListDetail, MoreBoxMenuItems, User } from "@/types";

interface TableRowProps {
  data: BoardListDetail;
  isUser: User;
  openedBoardId: number | null;
  onRowClick: (boardId: number) => void;
  onMoveProfile: (e: React.MouseEvent, memberId: number) => void;
  onCopyText: (gameName: string, tag: string, e: React.MouseEvent) => void;
  onMoreBoxToggle: (boardId: number | null) => void;
  menuItems: MoreBoxMenuItems[];
  moreBoxRef: React.RefObject<HTMLDivElement>;
  ignoreRef: MutableRefObject<boolean>;
}

const TableRow = ({
  data,
  isUser,
  openedBoardId,
  onRowClick,
  onMoveProfile,
  onCopyText,
  onMoreBoxToggle,
  menuItems,
  moreBoxRef,
  ignoreRef,
}: TableRowProps) => {
  return (
    <Row onClick={() => onRowClick(data.boardId)}>
      <ProfileCell
        gameName={data.gameName}
        tag={data.tag}
        memberId={data.memberId}
        profileImageId={data.profileImage}
        onMoveProfile={onMoveProfile}
        onCopyText={onCopyText}
      />
      <MannerLevelCell mannerLevel={data.mannerLevel} />
      <TierCell tier={data.tier} rank={data.rank} />
      <PositionCell mainP={data.mainP} subP={data.subP} />
      <WantPositionCell wantP={data.wantP || []} />
      <ChampionCell champions={data.championStatsResponseList || []} />
      <WinRateCell winRate={data.winRate} />
      <ContentCell contents={data.contents} />
      <MoreCell
        isUserId={isUser.id || 0}
        boardId={data.boardId}
        openedBoardId={openedBoardId}
        bumpTime={data.bumpTime}
        createdAt={data.createdAt}
        menuItems={menuItems}
        onMoreBoxToggle={onMoreBoxToggle}
        moreBoxRef={moreBoxRef}
        ignoreRef={ignoreRef}
      />
    </Row>
  );
};

const Row = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex items-center justify-between h-16 px-2 border-b border-[#d4d4d4] cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
export default TableRow;
