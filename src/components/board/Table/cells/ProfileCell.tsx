import styled from "styled-components";

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
  return (
    <Wrapper className="table_width">
      <ProfileImgWrapper
        $bgColor={getProfileBgColor(profileImageId)}
        onClick={(e) => onMoveProfile(e, memberId)}
      >
        <ProfileImg
          data={setCustomProfileImg(profileImageId)}
          width={35}
          height={35}
        />
      </ProfileImgWrapper>
      <NameRow>
        <P>{gameName}</P>
        <CopyButton onClick={(e) => onCopyText(gameName, tag, e)}>
          복사
        </CopyButton>
      </NameRow>
    </Wrapper>
  );
};

export default ProfileCell;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 50px;
  height: 50px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
  aspect-ratio: 1;
`;

const ProfileImg = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  &:hover > button {
    display: inline-flex;
  }
`;

const P = styled.p`
  ${(props) => props.theme.fonts.medium16};
  color: ${(props) => props.theme.colors.gray800};
  white-space: nowrap;
`;

const CopyButton = styled.button`
  width: auto;
  height: 20px;
  margin-left: 10px;
  border-radius: 2px;
  padding: 0px 7px;
  background: ${(props) => props.theme.colors.gray600};
  color: ${(props) => props.theme.colors.white};
  ${(props) => props.theme.fonts.medium11};
  line-height: 11px;
  white-space: nowrap;
  display: none;
  &:hover {
    color: ${(props) => props.theme.colors.violet300};
  }
`;
