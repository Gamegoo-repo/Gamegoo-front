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
  size = 45,
}: ProfileAvatarProps) => {
  const imageUrl = isBlind
    ? "/assets/images/profile/profile_default.svg"
    : `/assets/images/profile/profile${profileImgNum}.svg`;

  return (
    <ImageWrapper
      $bgColor={getProfileBgColor(profileImgNum)}
      onClick={onClick}
      $size={size}
    >
      <ProfileImage data={imageUrl} width={size - 12} height={size - 12} />
    </ImageWrapper>
  );
};

export default ProfileAvatar;

const ImageWrapper = styled.div<{ $bgColor: string; $size: number }>`
  position: relative;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
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
