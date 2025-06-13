import styled, { css } from "styled-components";
import Image from "next/image";
import { Dispatch } from "react";
import { getProfileBgColor } from "@/utils/profile";
import { theme } from "@/styles/theme";
import useMediaQueries from "@/hooks/useMediaQueries";
interface FileInputProps {
  setIsProfileListOpen: Dispatch<React.SetStateAction<boolean>>;
  isProfileListOpen: boolean;
  onImageClick: (index: number) => void;
  selectedImageIndex: number | undefined;
}

const UpdateProfileImage = (props: FileInputProps) => {
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const {
    setIsProfileListOpen,
    isProfileListOpen,
    onImageClick,
    selectedImageIndex,
  } = props;

  return (
    <Wrapper>
      {selectedImageIndex && (
        <ImageWrapper $bgColor={getProfileBgColor(selectedImageIndex)}>
          <ProfileImage
            data={`/assets/images/profile/profile${selectedImageIndex}.svg`}
            width={52}
            height={52}
          />
        </ImageWrapper>
      )}
      <CameraImgBg onClick={() => setIsProfileListOpen(!isProfileListOpen)}>
        <CameraImage data="/assets/icons/pencil.svg" width={26} height={26} />
      </CameraImgBg>
      {/* 프로필 이미지 선택 팝업 */}
      {isProfileListOpen && (
        <ProfileListBox>
          <Top>
            <Text>프로필 이미지 변경</Text>
            <Image
              src="/assets/icons/close_white.svg"
              width={9.45}
              height={9.45}
              alt="닫기"
              onClick={() => setIsProfileListOpen(false)}
            />
          </Top>
          <ProfileList>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
              <>
                <ProfileListWrapper
                  key={index}
                  $bgColor={getProfileBgColor(item)}
                  onClick={() => onImageClick(index)}
                >
                  <ProfileListImage
                    key={index}
                    data={`/assets/images/profile/profile${item}.svg`}
                    width={45}
                    height={45}
                    $isSelected={index + 1 === selectedImageIndex}
                  />
                </ProfileListWrapper>
              </>
            ))}
          </ProfileList>
        </ProfileListBox>
      )}
    </Wrapper>
  );
};

export default UpdateProfileImage;

const Wrapper = styled.div`
  position: relative;
  width: 74.98px;
  height: 74.98px;
  background: #c3b9ff;
  border-radius: 50%;
  z-index: 100;
  @media (max-width: 700px) {
    width: 48px;
    height: 48px;
  }
`;

const ImageWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 74.98px;
  height: 74.98px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;

  @media (max-width: 700px) {
    width: 48px;
    height: 48px;
  }
`;

const ProfileImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const CameraImgBg = styled.div`
  position: relative;
  width: 26px;
  height: 26px;
  background: #000000a1;
  box-shadow: 0 0 3.06px 0 #00000040;
  border-radius: 50%;
  top: -20px;

  @media (max-width: 700px) {
    width: 20px;
    height: 20px;
    top: -15px;
  }
`;

const CameraImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const ProfileListBox = styled.div`
  width: 333px;
  height: 205px;
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  gap: 6px;
  justify-content: flex-start;
  align-items: flex-end;
  border-radius: 13px;
  background: rgba(0, 0, 0, 0.64);
  top: 134px;
  left: 253px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Text = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.semiBold14}
`;

const ProfileList = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 0 29px 6px;
  row-gap: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
`;

const ProfileListWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 59px;
  height: 59px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const ProfileListImage = styled.object<{ $isSelected: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      opacity: 0.5;
    `}

  &:hover {
    filter: drop-shadow(0 4px 10px rgba(138, 117, 255, 0.7));
    transition: box-shadow 0.3s ease-in-out;
  }
`;
