import styled from "styled-components";
import Image from "next/image";
import { setProfileImg } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";
import useMediaQueries from "@/hooks/useMediaQueries";

interface ProfileImageProps {
  image: number;
}

const ProfileImage = (props: ProfileImageProps) => {
  const { image } = props;
  const isMobile = useMediaQueries({ breakpoint: 700 });

  return (
    <Wrapper $bgColor={getProfileBgColor(image)}>
      <StyledImage
        data={setProfileImg(image)}
        width={!isMobile ? 51 : 34}
        height={!isMobile ? 48 : 34}
      />
    </Wrapper>
  );
};

export default ProfileImage;

const Wrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 75px;
  height: 76px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
  margin-right: 12px;

  @media (max-width: 700px) {
    width: 48px;
    height: 48px;
    margin-right: 0px;
  }
`;

const StyledImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;
