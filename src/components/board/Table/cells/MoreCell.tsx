import styled from "styled-components";

import { MoreBox } from "@/components/common";
import { MoreBoxButton } from "@/components/readBoard";
import { theme } from "@/styles/theme";
import { setDateFormatter } from "@/utils";

export const MoreCell = ({
  bumpTime,
  createdAt,
  isUserId,
  isBoardId,
  boardId,
  isMoreBoxOpen,
  onMoreBoxToggle,
  onMoreBoxClose,
  menuItems,
}: {
  bumpTime: string;
  createdAt: string;
  isUserId: number;
  isBoardId: number;
  boardId: number;
  isMoreBoxOpen: boolean;
  onMoreBoxToggle: (boardId: number) => void;
  onMoreBoxClose: () => void;
  menuItems: any[];
}) => (
  <Ninth className="table_width">
    <P className="gray">{setDateFormatter(bumpTime || createdAt)}</P>
    {isUserId && (
      <More>
        <MoreBoxButton
          onClick={(e) => {
            e.stopPropagation();
            onMoreBoxToggle(boardId);
          }}
        />
        {isMoreBoxOpen && isBoardId === boardId && (
          <MoreBox
            items={menuItems}
            top={0}
            left={-180}
            onClose={onMoreBoxClose}
          />
        )}
      </More>
    )}
  </Ninth>
);

const Ninth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    width: 60px;
  }
`;

const More = styled.div`
  position: relative;
`;

const P = styled.p`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.gray800};
  white-space: nowrap;
  &.emph {
    color: ${theme.colors.violet600};
    ${(props) => props.theme.fonts.bold16};
  }
  &.gray {
    color: ${theme.colors.gray500};
    ${(props) => props.theme.fonts.medium16};
  }
`;
