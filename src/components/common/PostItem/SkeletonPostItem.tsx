import React from "react";
import styled from "styled-components";

import { SkeletonCircle, SkeletonText } from "@/components/common/Skeleton";
import { theme } from "@/styles/theme";

const SkeletonPostItem: React.FC = () => {
  return (
    <SkeletonCard>
      <ProfileRow>
        <SkeletonCircle width="44px" height="44px" />
        <div style={{ flex: 1 }}>
          <SkeletonText width="40%" height="24px" marginBottom="3px" />
          <SkeletonText width="10%" height="15px" />
        </div>
      </ProfileRow>

      <InfoRow>
        <SkeletonText width="100%" height="30px" />
        <SkeletonText width="100%" height="30px" />
      </InfoRow>

      <InfoRow>
        <SkeletonText width="100%" height="70px" />
        <SkeletonText width="100%" height="70px" />
      </InfoRow>

      <InfoRow>
        <ChampionRow>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCircle key={index} width="45px" height="45px" />
          ))}
        </ChampionRow>
        <SkeletonText width="50%" height="45px" />
      </InfoRow>

      <ContentBox>
        <SkeletonText width="100%" height="52px" />
      </ContentBox>
    </SkeletonCard>
  );
};

export default SkeletonPostItem;

const SkeletonCard = styled.div`
  width: 100%;
  height: 353px;
  background: ${theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

/* 티어, 포지션, 승률 영역 */
const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const ChampionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6.5px;
`;

const ContentBox = styled.div`
  width: 100%;
  height: 50px;
`;
