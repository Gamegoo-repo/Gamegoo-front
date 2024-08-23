import styled, { css } from "styled-components";
import Image from "next/image";
import { Dispatch } from 'react';
import { getProfileBgColor } from "@/utils/profile";

interface FileInputProps {
    setIsProfileListOpen: Dispatch<React.SetStateAction<boolean>>;
    isProfileListOpen: boolean;
    onImageClick: (index: number) => void;
    selectedImageIndex: number | undefined;
}

const UpdateProfileImage = (props: FileInputProps) => {
    const {
        setIsProfileListOpen,
        isProfileListOpen,
        onImageClick,
        selectedImageIndex
    } = props;

    return (
        <Wrapper>
            {selectedImageIndex &&
                <ImageWrapper $bgColor={getProfileBgColor(selectedImageIndex)}>
                    <ProfileImage
                        src={`/assets/images/profile/profile${selectedImageIndex}.svg`}
                        width={62}
                        height={60}
                        alt='프로필 이미지' />
                </ImageWrapper>
            }
            <Label htmlFor="profileImg">
                <CameraImgBg
                    onClick={() => setIsProfileListOpen(!isProfileListOpen)}
                >
                    <CameraImage
                        src="/assets/icons/camera_white.svg"
                        width={13}
                        height={10}
                        alt="프로필 이미지 변경" />
                </CameraImgBg>
            </Label>
            {/* 프로필 이미지 선택 팝업 */}
            {isProfileListOpen && (
                <ProfileListBox>
                    <Image
                        src="/assets/icons/close_white.svg"
                        width={9.45}
                        height={9.45}
                        alt="닫기"
                        onClick={() => setIsProfileListOpen(false)}
                    />
                    <ProfileList>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                            <>
                                <ProfileListWrapper $bgColor={getProfileBgColor(item)}>
                                    <ProfileListImage
                                        key={index}
                                        src={`/assets/images/profile/profile${item}.svg`}
                                        width={69}
                                        height={69}
                                        alt="프로필 이미지"
                                        $isSelected={index + 1 === selectedImageIndex}
                                        onClick={() => onImageClick(index)}
                                    />
                                </ProfileListWrapper>
                            </>
                        ))}
                    </ProfileList>
                </ProfileListBox>
            )
            }
        </Wrapper >
    )
};

export default UpdateProfileImage;

const Wrapper = styled.div`
    position: relative;
    width: 74.98px;
    height: 74.98px;
    background: #C3B9FF;
    border-radius: 50%;
`;

const ProfileListWrapper = styled.div<{ $bgColor: string }>`
    position: relative;
    width: 96px;
    height: 96px;
    background: ${(props) => props.$bgColor};
    border-radius: 50%;
`;

const ImageWrapper = styled.div<{ $bgColor: string }>`
    position: relative;
    width: 74px;
    height: 74px;
    background: ${(props) => props.$bgColor};
    border-radius: 50%;
`;

const ProfileImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`;

const Label = styled.label`
    cursor: pointer;
`;

const CameraImgBg = styled.div`
    position: relative;
    width: 23px;
    height: 23px; 
    background: #000000A1;
    box-shadow: 0 0 3.06px 0 #00000040;
    border-radius: 50%;
    top:69%; 
`;

const CameraImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`;

const ProfileListBox = styled.div`
    width: 353px;
    height: 224px;
    display: flex;
    flex-direction: column;
    padding: 20px 14px;
    gap: 6px;
    justify-content: center;
    align-items: flex-end;
    border-radius: 13px;
    background: rgba(0, 0, 0, 0.64);
    position: fixed;
    top: 164px;
    left: 253px;
    z-index: 100;
`;

const ProfileList = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 0 29px 6px;
    row-gap: 35px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
`;

const ProfileListImage = styled(Image) <{ $isSelected: boolean }>`
  cursor: pointer;
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