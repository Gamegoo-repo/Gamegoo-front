import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

export interface BlockedBoxProps {
  memberId: number;
  profileImg: number;
  email: string;
  name: string;
}

const BlockedBox: React.FC<BlockedBoxProps> = ({
  memberId,
  profileImg,
  email,
  name,
}) => {
  return (
    <Container>
      <Gap>
        <Image
          src={`/assets/images/profile/profile${profileImg}.svg`}
          width={54}
          height={54}
          alt="profile"
        />
        {name}
      </Gap>
      <Image
        src="/assets/icons/three_dots_button.svg"
        width={3}
        height={15}
        alt="more"
      />
    </Container>
  );
};

export default BlockedBox;

const Container = styled.div`
  width: 100%;
  height: 90px;
  padding: 17px 13px 17px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.gray600};
  border-bottom: 1px solid ${theme.colors.gray300};
  ${(props) => props.theme.fonts.semiBold18}
`;

const Gap = styled.div`
  display: flex;
  align-items: center;
  gap: 21px;
`;
