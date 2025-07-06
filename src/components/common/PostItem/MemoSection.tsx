import { FC } from "react";
import styled from "styled-components";

import { theme } from "@/styles/theme";
import { setDateFormatter } from "@/utils";

import { PostItemData } from "./PostItem";

import type { GameMode } from "@/types";

interface MemoSectionProps {
  data: PostItemData;
}

const MemoSection: FC<MemoSectionProps> = ({ data }) => {
  return (
    <Wrapper $gameType={data.gameMode}>
      <Memo>
        <MemoData>{data.contents}</MemoData>
      </Memo>
      <UpdatedDate>
        {setDateFormatter(data.bumpTime || data.createdAt)}
      </UpdatedDate>
    </Wrapper>
  );
};

export default MemoSection;

const Wrapper = styled.div<{ $gameType: GameMode }>`
  margin-top: ${({ $gameType }) => ($gameType !== "ARAM" ? "0px" : "46px")};
`;

const Memo = styled.div`
  @media (max-width: 700px) {
    width: 100%;
    height: 52px;
    padding: 11px 20px;
    border-radius: 15px;
    border: 1px solid ${theme.colors.gray400};
    overflow: hidden;

    border-radius: 6px;
    padding: 8px 10px;
  }
`;

const MemoData = styled.p`
  @media (max-width: 700px) {
    display: -webkit-box;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
    color: ${theme.colors.gray700};
    ${(props) => props.theme.fonts.regular12};
  }
`;

const UpdatedDate = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray500};
  text-align: right;
  margin-top: 6px;
`;
