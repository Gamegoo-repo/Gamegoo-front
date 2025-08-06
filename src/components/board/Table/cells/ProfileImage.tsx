import Image from "next/image";
import styled from "styled-components";

import { getProfileBgColor, setCustomProfileImg } from "@/utils";

interface ProfileImageWrapperProps {
  bgColor: string;
  width: number;
  height: number;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export const ProfileImage = ({
  width = 40,
  height = 40,
  profileImageId,
  gameName = "",
  onClick,
}: {
  width?: number;
  height?: number;
  profileImageId: number;
  gameName?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const bgColor = getProfileBgColor(profileImageId);
  const profileSrc = setCustomProfileImg(profileImageId);

  const imageScale = 0.69;

  return (
    <ProfileImageWrapper
      bgColor={bgColor}
      width={width}
      height={height}
      onClick={onClick}
    >
      <Image
        src={profileSrc}
        width={width * imageScale}
        height={height * imageScale}
        alt={gameName === "" ? "프로필 이미지" : `${gameName}의 프로필 이미지`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          objectFit: "contain",
        }}
      />
    </ProfileImageWrapper>
  );
};

const ProfileImageWrapper: React.FC<ProfileImageWrapperProps> = ({
  bgColor,
  width,
  height,
  onClick,
  children,
}) => {
  return (
    <div
      className="relative rounded-full cursor-pointer"
      onClick={onClick}
      style={{
        backgroundColor: bgColor,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {children}
    </div>
  );
};
