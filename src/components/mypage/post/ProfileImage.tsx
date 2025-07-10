import styled from "styled-components";

import { theme } from "@/styles/theme";
import { getProfileBgColor, setCustomProfileImg } from "@/utils";

interface ProfileImageProps {
  image: number;
}

const ProfileImage = (props: ProfileImageProps) => {
  const { image } = props;

  return (
    <Wrapper $bgColor={getProfileBgColor(image)}>
      <StyledImage data={setCustomProfileImg(image)} width={32} height={32} />
    </Wrapper>
  );
};

export default ProfileImage;

const Wrapper = styled.div<{ $bgColor: string }>`
  @media (max-width: ${theme.breakpoints.mobile}) {
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
