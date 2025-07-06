import { FC } from "react";

import styled from "styled-components";

import { theme } from "@/styles/theme";

import RankTier from "../RankTier";
import { PostItemData } from "./PostItem";

interface UserTierSectionProps {
  data: PostItemData;
  showTierSection: boolean;
}

const UserTierSection: FC<UserTierSectionProps> = ({
  data,
  showTierSection,
}) => {
  if (!showTierSection) {
    return null;
  }

  return (
    <UserTierWrapper>
      <RankTier
        type="solo"
        tier={data.soloTier || ""}
        rank={data.soloRank}
        direct="row"
        color={theme.colors.gray800}
        tierFontSize={theme.fonts.bold20}
      />
      <Bar />
      <RankTier
        type="free"
        tier={data.freeTier || ""}
        rank={data.freeRanks}
        direct="row"
        color={theme.colors.gray800}
        tierFontSize={theme.fonts.bold20}
      />
    </UserTierWrapper>
  );
};

export default UserTierSection;

const UserTierWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 17px 0 23px;
`;

const Bar = styled.div`
  width: 1px;
  height: 12px;
  background: ${theme.colors.gray400};
`;
