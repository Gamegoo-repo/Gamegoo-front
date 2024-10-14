import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { Chat } from "@/interface/chat";
import MoreBox from "../common/MoreBox";
import { useDispatch, useSelector } from "react-redux";
import { closeChat, closeChatRoom, openChat } from "@/redux/slices/chatSlice";
import { getProfileBgColor } from "@/utils/profile";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { useEffect } from "react";

interface MessageHeaderProps {
  isMoreBoxOpen: boolean;
  chatEnterData?: Chat;
  onMoreBoxOpen: () => void;
  menuItems: MoreBoxMenuItems[];
}

const MessageHeader = (props: MessageHeaderProps) => {
  const { isMoreBoxOpen, chatEnterData, onMoreBoxOpen, menuItems } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const onlineFriends = useSelector(
    (state: RootState) => state.chat.onlineFriends
  );

  const handleMoveProfile = async (memberId: number) => {
    await router.push(`/user/${memberId}`);
    await dispatch(closeChat());
    await dispatch(closeChatRoom());
  };

  const handleGoToPrevious = () => {
    dispatch(closeChatRoom());
    dispatch(openChat());
  };

  return (
    <>
      {isMoreBoxOpen && <MoreBox items={menuItems} top={35} left={200} />}
      <CloseButton>
        <CloseImage
          onClick={() => dispatch(closeChatRoom())}
          src="/assets/icons/close.svg"
          width={11}
          height={11}
          alt="닫기"
        />
      </CloseButton>
      {chatEnterData && (
        <ChatHeader>
          <PrevImage
            onClick={handleGoToPrevious}
            src="/assets/icons/left_arrow.svg"
            width={9}
            height={18}
            alt="뒤로가기"
          />
          <Middle>
            <ImageWrapper
              $bgColor={getProfileBgColor(chatEnterData.memberProfileImg)}
              onClick={() => handleMoveProfile(chatEnterData.memberId)}
            >
              <ProfileImage
                data={
                  chatEnterData.blind
                    ? `/assets/images/profile/profile_default.svg`
                    : `/assets/images/profile/profile${chatEnterData.memberProfileImg}.svg`
                }
                width={38}
                height={38}
              />
            </ImageWrapper>
            <Div>
              <UserName
                onClick={() => router.push(`/user/${chatEnterData.memberId}`)}
              >
                {chatEnterData.gameName}
              </UserName>
              {onlineFriends.includes(chatEnterData.memberId) ? (
                <>
                  <OnlineStatus>온라인</OnlineStatus>
                  <OnlineImage
                    src="/assets/icons/online.svg"
                    width={5}
                    height={5}
                    alt="온라인"
                  />
                </>
              ) : (
                <OnlineStatus>오프라인</OnlineStatus>
              )}
            </Div>
          </Middle>
          <ThreeDotsImage
            onClick={onMoreBoxOpen}
            src="/assets/icons/three_dots_button.svg"
            width={3}
            height={15}
            alt="상세보기"
          />
        </ChatHeader>
      )}
    </>
  );
};

export default MessageHeader;

const CloseButton = styled.p`
  display: flex;
  margin-bottom: 1px;
  padding: 12px 13px 0 0;
`;

const CloseImage = styled(Image)`
  margin-left: auto;
  cursor: pointer;
`;

const ChatHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 11px 27px 20px 12px;
`;

const PrevImage = styled(Image)`
  margin-right: 18px;
  cursor: pointer;
`;

const Middle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

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

const ThreeDotsImage = styled(Image)`
  cursor: pointer;
`;

const Div = styled.div`
  position: relative;
  margin-left: 9px;
`;

const UserName = styled.p`
  ${(props) => props.theme.fonts.semiBold18};
  color: ${theme.colors.gray600};
  cursor: pointer;
`;

const OnlineStatus = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray200};
`;

const OnlineImage = styled(Image)`
  position: absolute;
  top: 1%;
  right: -11%;
`;
