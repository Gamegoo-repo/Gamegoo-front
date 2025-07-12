import styled from "styled-components";

import { theme } from "@/styles/theme";

export const WinRateCell = ({ winRate }: { winRate: number | null }) => (
  <Seventh className="table_width">
    <P className={winRate && winRate >= 50 ? "emph" : "basic"}>
      {winRate === null ? "0%" : `${winRate}%`}
    </P>
  </Seventh>
);

const Seventh = styled.div``;

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
