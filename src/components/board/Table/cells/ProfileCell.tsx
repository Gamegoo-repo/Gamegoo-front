import Image from "next/image";
import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { setCustomProfileImg } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";

import { ProfileImage } from "./ProfileImage";

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
    <div className="table_width flex items-center">
      <div className="flex gap-2 items-center justify-start">
        <ProfileImage
          profileImageId={profileImageId}
          gameName={gameName}
          onClick={(e) => onMoveProfile(e, memberId)}
        />
        <div className="flex flex-col gap-0.5 justify-center">
          <div className="flex gap-1 items-center">
            <span className="text-base font-semibold text-gray-800">
              {gameName}
            </span>
          </div>
          <TagRow>
            <Tag>#{tag}</Tag>
            <CopyButton onClick={handleCopyClipBoard}>복사</CopyButton>
          </TagRow>
        </div>
      </div>
    </div>
  );
};

export default ProfileCell;

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
