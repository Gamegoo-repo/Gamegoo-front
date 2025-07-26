import styled from "styled-components";

import { ChampionCell } from "./cells/ChampionCell";
import { ContentCell } from "./cells/ContentCell";
import { MannerLevelCell } from "./cells/MannerLevelCell";
import { MoreCell } from "./cells/MoreCell";
import { PositionCell } from "./cells/PositionCell";
import ProfileCell from "./cells/ProfileCell";
import { TierCell } from "./cells/TierCell";
import { WantPositionCell } from "./cells/WantPositionCell";
import { WinRateCell } from "./cells/WinRateCell";

import type { MutableRefObject } from "react";
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

export default TableRow;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 21px;
  border-bottom: 1px solid #d4d4d4;
  cursor: pointer;
`;
