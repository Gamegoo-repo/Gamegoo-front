import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { FC } from "react";

import ProfileImage from "./ProfileImage";
import UserNManner from "./UserNManner";
import MoreBox from "../../MoreBox";
import MoreBoxButton from "../../../readBoard/MoreBoxButton";
import { PostItemData } from "../PostItem";
import { MoreBoxMenuItems } from "@/interface/moreBox";

interface UserSectionProps {
  data: PostItemData;
  isMannerLevelBoxOpen: boolean;
  onMannerLevelBoxToggle: () => void;
  onProfileClick: (e: React.MouseEvent) => void;
  mannerLevelBoxRef: React.RefObject<HTMLDivElement>;
  showMoreButton: boolean;
  isMoreBoxOpen: boolean;
  onMoreBoxToggle: (e: React.MouseEvent) => void;
  onMoreBoxClose: () => void;
  moreBoxMenuItems: MoreBoxMenuItems[];
}

const UserSection: FC<UserSectionProps> = ({
  data,
  isMannerLevelBoxOpen,
  onMannerLevelBoxToggle,
  onProfileClick,
  mannerLevelBoxRef,
  showMoreButton,
  isMoreBoxOpen,
  onMoreBoxToggle,
  onMoreBoxClose,
  moreBoxMenuItems,
}) => {
  return (
    <Wrapper>
      <UserLeft>
        <UserProfileWrapper onClick={onProfileClick}>
          <ProfileImage image={data.profileImage} />
          <UserNManner
            mannerLevel={data.mannerLevel}
            memberId={data.memberId}
            isMannerLevelBoxOpen={isMannerLevelBoxOpen}
            onMannerLevelBoxToggle={onMannerLevelBoxToggle}
            mannerLevelBoxRef={mannerLevelBoxRef}
          />
        </UserProfileWrapper>
        <UserAccountWrapper>
          <UserAccountRow>
            <UserAccount>{data.gameName}</UserAccount>
          </UserAccountRow>
          {data.tag && <UserAccountTag>#{data.tag}</UserAccountTag>}
        </UserAccountWrapper>
      </UserLeft>

      {showMoreButton && (
        <UserRight>
          <More>
            <MoreBoxButton onClick={onMoreBoxToggle} />
            {isMoreBoxOpen && (
              <MoreBox
                items={moreBoxMenuItems}
                top={30}
                right={10}
                onClose={onMoreBoxClose}
              />
            )}
          </More>
        </UserRight>
      )}
    </Wrapper>
  );
};

export default UserSection;

const Wrapper = styled.div`
  @media (max-width: 700px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    margin-bottom: 24px;
  }
`;

const UserLeft = styled.div`
  @media (max-width: 700px) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const UserProfileWrapper = styled.div`
  @media (max-width: 700px) {
    position: relative;
    z-index: 2;
    cursor: pointer;
  }
`;

const UserAccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserAccountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAccount = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray700};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.bold16};
  }
`;

const UserAccountTag = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray500};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.semiBold12};
  }
`;

const UserRight = styled.div`
  position: relative;
  display: flex;
  width: 25px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const More = styled.div`
  position: relative;
`;
