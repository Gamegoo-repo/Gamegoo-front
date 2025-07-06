import styled from "styled-components";

import { setProfileImg } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";

interface ProfileImageProps {
  image: number;
}

const ProfileImage = (props: ProfileImageProps) => {
  const { image } = props;

  return (
    <Wrapper $bgColor={getProfileBgColor(image)}>
      <StyledImage data={setProfileImg(image)} width={32} height={32} />
    </Wrapper>
  );
};

export default ProfileImage;

const Wrapper = styled.div<{ $bgColor: string }>`
  @media (max-width: 700px) {
    position: relative;
    background: ${(props) => props.$bgColor};
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
`;

const StyledImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;
