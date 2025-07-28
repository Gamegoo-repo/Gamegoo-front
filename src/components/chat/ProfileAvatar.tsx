import styled from "styled-components";

import { getProfileBgColor } from "@/utils";

interface ProfileAvatarProps {
  profileImgNum: number | null;
  isBlind: boolean;
  onClick?: () => void;
  size?: number;
}

const ProfileAvatar = ({
  profileImgNum,
  isBlind,
  onClick,
  size = 33,
}: ProfileAvatarProps) => {
  const imageUrl = isBlind
    ? "/assets/images/profile/profile_default.svg"
    : `/assets/images/profile/profile${profileImgNum}.svg`;

  return (
    <ImageWrapper $bgColor={getProfileBgColor(profileImgNum)} onClick={onClick}>
      <ProfileImage data={imageUrl} width={size} height={size} />
    </ImageWrapper>
  );
};

export default ProfileAvatar;

const ImageWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 47px;
  height: 47px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const ProfileImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;
