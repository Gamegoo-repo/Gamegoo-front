import Image from "next/image";
import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { setCustomProfileImg } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";

interface ProfileCellProps {
  profileImageId: number;
  gameName: string;
  tag: string;
  memberId: number;
  onMoveProfile: (e: React.MouseEvent, memberId: number) => void;
  onCopyText: (gameName: string, tag: string, e: React.MouseEvent) => void;
}

const ProfileCell = ({
  profileImageId,
  gameName,
  tag,
  memberId,
  onMoveProfile,
  onCopyText,
}: ProfileCellProps) => {
  function handleCopyClipBoard(e: React.MouseEvent) {
    onCopyText(gameName, tag, e);
  }

  return (
    <Wrapper className="table_width">
      <Container>
        <ProfileImage
          profileImageId={profileImageId}
          gameName={gameName}
          onClick={(e) => onMoveProfile(e, memberId)}
        />
        <InfoContainer>
          <NameRow>
            <GameName>{gameName}</GameName>
            <PunchIcon>
              <Icon
                backgroundUrl="/assets/icons/board/punch.svg"
                width={9}
                height={9}
              />
            </PunchIcon>
          </NameRow>
          <TagRow>
            <Tag>#{tag}</Tag>
            <CopyButton onClick={handleCopyClipBoard}>복사</CopyButton>
          </TagRow>
        </InfoContainer>
      </Container>
    </Wrapper>
  );
};

export default ProfileCell;

export const ProfileImage = ({
  width = 35,
  height = 35,
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
      $bgColor={bgColor}
      $width={width}
      $height={height}
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

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
`;

const NameRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const GameName = styled.span`
  line-height: 1;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray800};
  white-space: nowrap;
`;

const PunchIcon = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #b91c1c;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TagRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
`;

const Tag = styled.span`
  font-size: 13px;
  font-weight: normal;
  line-height: 1;
  color: ${(props) => props.theme.colors.gray600};
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 19px;
  line-height: 1;
  background-color: ${(props) => props.theme.colors.gray100};
  border: 1px solid ${(props) => props.theme.colors.gray300};
  color: ${(props) => props.theme.colors.gray600};
  font-weight: 500;
  font-size: 11px;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray200};
  }
`;

const ProfileImageWrapper = styled.div<{
  $bgColor: string;
  $width: number;
  $height: number;
}>`
  position: relative;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${(props) => props.$bgColor};
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
`;
