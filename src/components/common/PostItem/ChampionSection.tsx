import { FC } from "react";
import styled from "styled-components";

import { theme } from "@/styles/theme";

import Champion from "../Champion";
import { PostItemData } from "./PostItem";

interface ChampionSectionProps {
  data: PostItemData;
  variant: "list" | "mypage";
}

const ChampionSection: FC<ChampionSectionProps> = ({ data, variant }) => {
  return (
    <ChampionNWinRateSection>
      <Champion font="semiBold14" list={data.championStatsResponseList} />
      <WinRate>
        승률
        <Rate $rate={data.winRate} $variant={variant}>
          {data.winRate}%
        </Rate>
      </WinRate>
    </ChampionNWinRateSection>
  );
};

export default ChampionSection;

const ChampionNWinRateSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const WinRate = styled.div`
  ${theme.fonts.medium11};
  color: ${theme.colors.gray800};
`;

const Rate = styled.div<{ $rate: number; $variant: "list" | "mypage" }>`
  ${theme.fonts.bold16};

  /* PostList에서는 승률에 따라 색상 변경, MoPost에서는 고정 색상 */
  color: ${({ $rate, $variant }) => {
    if ($variant === "list") {
      return $rate >= 70
        ? "#CA1FCF"
        : $rate >= 50
          ? theme.colors.violet600
          : theme.colors.gray700;
    } else {
      return theme.colors.violet600;
    }
  }};
`;
