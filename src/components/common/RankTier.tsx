import React from "react";
import styled, { css } from "styled-components";

import { theme } from "@/styles/theme";
import { setTierAbbr, toCapitalizedString, toLowerCaseString } from "@/utils";

type RankType = "solo" | "free";

interface RankTierProps {
  type: RankType;
  tier: string;
  rank?: number;
  direct?: string;
  color?: string;
  rankFontSize?: string;
  tierFontSize?: string;
  isTierAbbr?: boolean; // 티어명 축약 여부
}

const RankTier = (props: RankTierProps) => {
  const {
    type,
    tier,
    rank,
    direct = "column",
    color,
    rankFontSize,
    tierFontSize,
    isTierAbbr = false,
  } = props;

  return (
    <Container $direct={direct}>
      <RankName $direct={direct} $color={color} $fontSize={rankFontSize}>
        {type === "solo" ? "솔로랭크" : "자유랭크"}
      </RankName>
      <Tier $direct={direct} $color={color} $fontSize={tierFontSize}>
        <TierImage
          data={`/assets/images/tier/${
            toLowerCaseString(tier) || "unranked"
          }.svg`}
          width={direct === "row" ? 24 : 32}
          height={direct === "row" ? 24 : 32}
        />
        {isTierAbbr
          ? setTierAbbr(tier) + (rank ? `${rank}` : "")
          : toCapitalizedString(tier || "UNRANK") + (rank ? ` ${rank}` : "")}
      </Tier>
    </Container>
  );
};

export default RankTier;

const Container = styled.div<{ $direct: string }>`
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${({ $direct }) =>
    $direct === "row" &&
    css`
      flex-direction: row;
      align-items: center;
      gap: 6px;
    `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${({ $direct }) =>
      $direct === "row" &&
      css`
        gap: 3px;
      `}
  }
`;

const RankName = styled.div<{
  $direct: string;
  $color?: string;
  $fontSize?: string;
}>`
  color: ${({ $color, theme }) => ($color ? $color : theme.colors.gray600)};
  ${({ $fontSize }) => ($fontSize ? $fontSize : theme.fonts.semiBold14)};

  ${({ $direct }) =>
    $direct === "row" &&
    css`
      ${theme.fonts.bold13}
    `}
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.medium11}
    ${({ $direct }) =>
      $direct === "row" &&
      css`
        color: ${theme.colors.gray500};
      `}
  }
`;

const Tier = styled.div<{
  $direct: string;
  $color?: string;
  $fontSize?: string;
}>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $color, theme }) => ($color ? $color : theme.colors.gray700)};
  ${({ $fontSize }) => ($fontSize ? $fontSize : theme.fonts.bold25)};

  ${({ $direct }) =>
    $direct === "row" &&
    css`
      color: ${theme.colors.gray600};
      ${theme.fonts.bold14}
    `}
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.bold14}

    ${({ $direct }) =>
      $direct === "row" &&
      css`
        ${theme.fonts.bold12}
      `}
  }
`;

const TierImage = styled.object`
  pointer-events: none;
`;
