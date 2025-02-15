import { theme } from "@/styles/theme";
import { toCapitalizedString, toLowerCaseString } from "@/utils/string";
import React from "react";
import styled from "styled-components";

type RankType = "solo" | "free";

interface RankTierProps {
  type: RankType;
  tier: string;
  rank?: number;
}

const RankTier = (props: RankTierProps) => {
  const { type, tier, rank } = props;

  return (
    <Container>
      <RankName>{type === "solo" ? "솔로랭크" : "자유랭크"}</RankName>
      <Tier>
        <TierImage
          data={`/assets/images/tier/${
            toLowerCaseString(tier) || "unrank"
          }.svg`}
          width={32}
          height={32}
        />
        {toCapitalizedString(tier) + (rank ? ` ${rank}` : "")}
      </Tier>
    </Container>
  );
};

export default RankTier;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RankName = styled.div`
  color: ${theme.colors.gray800};
  ${theme.fonts.regular14}
`;

const Tier = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.gray700};
  ${theme.fonts.bold20}
`;

const TierImage = styled.object`
  pointer-events: none;
`;
