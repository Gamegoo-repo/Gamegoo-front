import styled, { css } from "styled-components";
import Image from "next/image";
import { Dispatch } from "react";
import { getProfileBgColor } from "@/utils/profile";
import { theme } from "@/styles/theme";
import useMediaQueries from "@/hooks/useMediaQueries";

type ProfileType = "matching" | "mypage" | "board";
type SizeType = "large" | "medium" | "semiMedium" | "small";

interface FileInputProps {
  type: ProfileType;
  setIsProfileListOpen: Dispatch<React.SetStateAction<boolean>>;
  isProfileListOpen: boolean;
  isEditable?: boolean;
  onImageClick: (index: number) => void;
  selectedImageIndex: number | undefined;
}

const UpdateProfileImage = (props: FileInputProps) => {
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const {
    type,
    setIsProfileListOpen,
    isProfileListOpen,
    isEditable = true,
    onImageClick,
    selectedImageIndex,
  } = props;

  const getSizeByContext = (
    type: ProfileType,
    isMobile: boolean | undefined
  ): SizeType => {
    if (type === "matching" && !isMobile) return "large";
    if (type === "mypage" && !isMobile) return "medium";
    if (type === "board" && !isMobile) return "semiMedium";
    return "small";
  };

  const size = getSizeByContext(type, isMobile);
  const isLarge = size === "large" || size === "medium";

  return (
    <Wrapper $size={size}>
      {selectedImageIndex && (
        <ImageWrapper
          $bgColor={getProfileBgColor(selectedImageIndex)}
          $isLarge={isLarge}
        >
          <ProfileImg
            data={`/assets/images/profile/profile${selectedImageIndex}.svg`}
            width={
              size === "large"
                ? 120
                : size === "medium"
                  ? 80
                  : size === "semiMedium"
                    ? 50
                    : 35
            }
            height={
              size === "large"
                ? 120
                : size === "medium"
                  ? 80
                  : size === "semiMedium"
                    ? 50
                    : 35
            }
            $isFilter={type !== "board"}
          />
        </ImageWrapper>
      )}

      {isEditable && (
        <EditButton
          $size={size}
          onClick={() => setIsProfileListOpen(!isProfileListOpen)}
        >
          <EditIcon
            data="/assets/icons/edit_pencil.svg"
            width={
              size === "large"
                ? 35
                : size === "medium"
                ? 18
                : size === "semiMedium"
                ? 13
                : 10
            }
            height={
              size === "large"
                ? 30
                : size === "medium"
                ? 18
                : size === "semiMedium"
                ? 13
                : 10
            }
          />
        </EditButton>
      )}


      {isProfileListOpen && (
        <ProfileListBox $isLarge={isLarge}>
          <Top>
            <Text $isLarge={isLarge}>
              {`프로필 이미지 ${type === "matching" ? "선택" : "변경"}`}
            </Text>
            <button onClick={() => setIsProfileListOpen(false)}>
              <Image
                src="/assets/icons/close_white.svg"
                width={isLarge ? 24 : 16}
                height={isLarge ? 24 : 16}
                alt="닫기"
              />
            </button>
          </Top>
          <ProfileList $isLarge={isLarge}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <ProfileItem
                key={item}
                $bgColor={getProfileBgColor(item)}
                $isSelected={item === selectedImageIndex}
                $isLarge={isLarge}
                onClick={() => onImageClick(item)}
              >
                {item === selectedImageIndex && (
                  <CheckIcon
                    $isLarge={isLarge}
                    data={`/assets/icons/check_white.svg`}
                    width={isLarge ? 36 : 10}
                    height={isLarge ? 36 : 10}
                  />
                )}
                <ProfileImgInner
                  data={`/assets/images/profile/profile${item}.svg`}
                  width={isLarge ? 70 : 45}
                  height={isLarge ? 70 : 45}
                />
              </ProfileItem>
            ))}
          </ProfileList>
        </ProfileListBox>
      )}
    </Wrapper>
  );
};

export default UpdateProfileImage;

const Wrapper = styled.div<{ $size: SizeType }>`
  position: relative;
  width: ${(props) =>
    props.$size === "large"
      ? "186px"
      : props.$size === "medium"
        ? "120px"
        : props.$size === "semiMedium"
          ? "75px"
          : "52px"};
  height: ${(props) =>
    props.$size === "large"
      ? "186px"
      : props.$size === "medium"
        ? "120px"
        : props.$size === "semiMedium"
          ? "75px"
          : "52px"};
  z-index: 100;
`;

const ImageWrapper = styled.div<{ $bgColor: string; $isLarge: boolean }>`
  width: 100%;
  height: 100%;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1 / 1;
`;

const ProfileImg = styled.object<{ $isFilter: boolean }>`
  pointer-events: none;

  ${(props) =>
    props.$isFilter &&
    css`
      filter: drop-shadow(-4px 10px 10px rgba(63, 53, 78, 0.582));
    `};
`;

const EditButton = styled.button<{ $size: SizeType }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${(props) =>
    props.$size === "large"
      ? "56px"
      : props.$size === "medium"
        ? "36px"
        : props.$size === "semiMedium"
          ? "26px"
          : "20px"};
  height: ${(props) =>
    props.$size === "large"
      ? "56px"
      : props.$size === "medium"
        ? "36px"
        : props.$size === "semiMedium"
          ? "26px"
          : "20px"};
  background: #000000a1;
  box-shadow: 0 0 3.06px 0 #00000040;
  border-radius: 50%;
`;

const EditIcon = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const ProfileListBox = styled.div<{ $isLarge: boolean }>`
  position: absolute;
  bottom: ${(props) => (props.$isLarge ? "-360px" : "-220px")};
  left: ${(props) => (props.$isLarge ? "10px" : "-10px")};
  width: ${(props) => (props.$isLarge ? "527px" : "344px")};
  height: ${(props) => (props.$isLarge ? "335px" : "211px")};
  background: rgba(0, 0, 0, 0.64);
  border-radius: ${(props) => (props.$isLarge ? "20px" : "13px")};
  padding: ${(props) => (props.$isLarge ? "32px" : "22px")};
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$isLarge ? "28px" : "18px")};
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
`;

const Text = styled.div<{ $isLarge: boolean }>`
  ${(props) =>
    props.$isLarge
      ? css`
          ${theme.fonts.bold20};
        `
      : css`
          ${theme.fonts.semiBold14};
        `}
`;

const ProfileList = styled.div<{ $isLarge: boolean }>`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  ${(props) =>
    props.$isLarge
      ? css`
          gap: 20px;
        `
      : css`
          row-gap: 12px;
          column-gap: 8px;
        `}
`;

const ProfileItem = styled.div<{
  $bgColor: string;
  $isSelected: boolean;
  $isLarge: boolean;
}>`
  position: relative;
  width: ${(props) => (props.$isLarge ? "96px" : "60px")};
  height: ${(props) => (props.$isLarge ? "96px" : "60px")};
  background: ${(props) => props.$bgColor};
  border-radius: 50%;

  ${(props) =>
    props.$isSelected &&
    css`
      border: 3px solid ${theme.colors.white};
    `}

  &:hover {
    filter: drop-shadow(0px 4px 10px rgba(138, 117, 255, 0.7));
    transition: box-shadow 0.3s ease-in-out;
  }
`;

const CheckIcon = styled.object<{ $isLarge: boolean }>`
  width: ${(props) => (props.$isLarge ? "36px" : "21px")};
  height: ${(props) => (props.$isLarge ? "36px" : "21px")};
  position: absolute;
  top: ${(props) => (props.$isLarge ? "-5px" : "-3px")};
  left: ${(props) => (props.$isLarge ? "-5px" : "-3px")};
  background: ${theme.colors.violet600};
  border-radius: 50%;
  border: 3px solid ${theme.colors.white};
  z-index: 10;
`;

const ProfileImgInner = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;
