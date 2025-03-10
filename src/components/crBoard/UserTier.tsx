import styled from "styled-components";
import RankTier from "../common/RankTier";
import Image from "next/image";

interface UserProps {
  soloTier: string;
  freeTier: string;
  soloRank?: number;
  freeRank?: number;
}

const UserTier = (props: UserProps) => {
  const { soloTier, freeTier, soloRank, freeRank } = props;

  return (
    <Wrapper>
      <RankTier type="solo" tier={soloTier} rank={soloRank} direct="row" />
      <Image src="/assets/icons/bar_gray.svg" width={1} height={12} alt="" />
      <RankTier type="free" tier={freeTier} rank={freeRank} direct="row" />
    </Wrapper>
  );
};

export default UserTier;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
