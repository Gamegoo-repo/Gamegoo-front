import styled from "styled-components";

import { Champion } from "@/components/common";
import { theme } from "@/styles/theme";

export const ChampionCell = ({ champions }: { champions: any[] }) => (
  <Sixth className="table_width">
    {champions.length > 0 ? (
      <Champion font="semiBold14" list={champions} />
    ) : (
      <Blank>챔피언 정보가 없습니다.</Blank>
    )}
  </Sixth>
);

const Sixth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Blank = styled.div`
  color: ${theme.colors.gray400};
  ${theme.fonts.medium14};
`;
