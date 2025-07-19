import { useRef } from "react";
import styled from "styled-components";

import { MoreBox } from "@/components/common";
import { MoreBoxButton } from "@/components/readBoard";
import { theme } from "@/styles/theme";
import { setDateFormatter } from "@/utils";

import type { MutableRefObject } from "react";

export const MoreCell = ({
  isUserId,
  boardId,
  openedBoardId,
  bumpTime,
  createdAt,
  menuItems,
  onMoreBoxToggle,
  moreBoxRef,
  ignoreRef,
}: {
  isUserId: number;
  boardId: number;
  openedBoardId: number | null;
  bumpTime: string;
  createdAt: string;
  menuItems: any[];
  onMoreBoxToggle: (boardId: number | null) => void;
  moreBoxRef: React.RefObject<HTMLDivElement>;
  ignoreRef: MutableRefObject<boolean>;
}) => {
  const isOpen = openedBoardId === boardId;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    ignoreRef.current = true;
    onMoreBoxToggle(boardId);
  };

  return (
    <Ninth className="table_width">
      <P className="gray">{setDateFormatter(bumpTime || createdAt)}</P>
      {isUserId && (
        <More ref={moreBoxRef}>
          <MoreBoxButton ref={buttonRef} onClick={handleButtonClick} />
          {isOpen && (
            <MoreBox
              items={menuItems}
              top={0}
              left={-180}
              onClose={() => onMoreBoxToggle(null)}
            />
          )}
        </More>
      )}
    </Ninth>
  );
};

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
