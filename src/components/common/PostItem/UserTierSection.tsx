import styled from "styled-components";
import { theme } from "@/styles/theme";
import { FC } from "react";
import RankTier from "../RankTier";
import { PostItemData } from "./PostItem";

interface UserTierSectionProps {
  data: PostItemData;
}

const UserTierSection: FC<UserTierSectionProps> = ({ data }) => {
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
        rank={data.freeRank}
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
