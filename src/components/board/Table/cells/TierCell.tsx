import styled from "styled-components";

import { theme } from "@/styles/theme";
import { setTierAbbr, toLowerCaseString } from "@/utils";

export const TierCell = ({ tier, rank }: { tier: string; rank?: number }) => (
  <Third className="table_width">
    <TierImage
      data={
        !tier
          ? "/assets/images/tier/unranked.svg"
          : `/assets/images/tier/${toLowerCaseString(tier)}.svg`
      }
      width={28}
      height={26}
    />
    <P>
      {setTierAbbr(tier || "")}
      {tier !== "UNRANKED" && rank}
    </P>
  </Third>
);

const Third = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
`;

const TierImage = styled.object`
  pointer-events: none;
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
