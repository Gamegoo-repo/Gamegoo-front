import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { useMediaQueryContext } from "@/hooks";
import {
  closeChat,
  closeChatRoom,
  openChat,
  setChatRoomUuid,
} from "@/redux/slices/chatSlice";
import { setOpenAlertModal } from "@/redux/slices/modalSlice";
import { theme } from "@/styles/theme";

import { MoreBox } from "../common";
import ProfileAvatar from "./ProfileAvatar";

import type { RootState } from "@/redux/store";
import type { Chat, MoreBoxMenuItems } from "@/types";

interface MessageHeaderProps {
  isMoreBoxOpen: boolean;
  chatEnterData?: Chat;
  onMoreBoxOpen: () => void;
  menuItems: MoreBoxMenuItems[];
  disabled?: boolean;
  setIsMoreBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessageHeader = (props: MessageHeaderProps) => {
  const {
    isMoreBoxOpen,
    chatEnterData,
    onMoreBoxOpen,
    menuItems,
    disabled = false,
    setIsMoreBoxOpen,
  } = props;

  const { isMobile } = useMediaQueryContext();
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
    if (disabled) {
      showLoginAlert();
    } else {
      dispatch(setChatRoomUuid(null));
      dispatch(closeChatRoom());
      dispatch(openChat());
    }
  };

  const handleMoreBoxOpen = () => {
    if (disabled) {
      showLoginAlert();
    } else {
      onMoreBoxOpen();
    }
  };

  const showLoginAlert = () => {
    dispatch(
      setOpenAlertModal({
        icon: "exclamation",
        width: 68,
        height: 58,
        content: "로그인이 필요한 서비스입니다.",
        alt: "경고",
        buttonText: "확인",
      })
    );
  };

  return (
    <>
      {isMoreBoxOpen && (
        <MoreBox
          items={menuItems}
          top={35}
          right={40}
          onClose={() => setIsMoreBoxOpen(false)}
        />
      )}
      {!isMobile ? (
        <CloseButtonWrapper>
          <CloseButton onClick={() => dispatch(closeChatRoom())}>
            <Icon
              backgroundUrl="/assets/icons/close_chat.svg"
              width={12}
              height={12}
            />
          </CloseButton>
        </CloseButtonWrapper>
      ) : (
        <TitleWrap>
          <Title>채팅</Title>
          <CloseButton onClick={() => dispatch(closeChatRoom())}>
            <Icon
              backgroundUrl="/assets/icons/close_modal.svg"
              width={11}
              height={11}
            />
          </CloseButton>
        </TitleWrap>
      )}

      {chatEnterData && (
        <ChatHeader>
          <PrevButton onClick={handleGoToPrevious}>
            <Icon
              backgroundUrl="/assets/icons/chevron_left.svg"
              width={9}
              height={18}
            />
          </PrevButton>
          <Middle>
            <ProfileAvatar
              profileImgNum={chatEnterData.memberProfileImg}
              isBlind={chatEnterData.blind}
              onClick={() => handleMoveProfile(chatEnterData.memberId)}
              size={47}
            />
            <Div>
              <UserName
                onClick={() => router.push(`/user/${chatEnterData.memberId}`)}
              >
                {chatEnterData.gameName}
              </UserName>
              {chatEnterData?.friend && (
                <>
                  {onlineFriends.includes(chatEnterData.memberId) ? (
                    <>
                      <OnlineStatus>온라인</OnlineStatus>
                      <Icon
                        backgroundUrl="/assets/icons/online.svg"
                        width={5}
                        height={5}
                        style={{
                          position: "absolute",
                          top: "0%",
                          right: "-10px",
                        }}
                      />
                    </>
                  ) : (
                    <OnlineStatus>오프라인</OnlineStatus>
                  )}
                </>
              )}
            </Div>
          </Middle>
          <ThreeDotsButton onClick={handleMoreBoxOpen}>
            <Icon
              backgroundUrl="/assets/icons/three_dots_button_black.svg"
              width={3}
              height={15}
            />
          </ThreeDotsButton>
        </ChatHeader>
      )}
    </>
  );
};

export default MessageHeader;

const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 12px 16px;
  }
`;

const Title = styled.p`
  ${theme.fonts.bold20}
  color: ${theme.colors.gray800};
`;

const CloseButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 18px 0 0;
`;

const CloseButton = styled.button`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0;
  }
`;

const ChatHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 12px 16px;
  }
`;

const PrevButton = styled.button`
  width: 18px;
  height: 18px;
  margin-right: 18px;
  cursor: pointer;
`;

const Middle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Div = styled.div`
  position: relative;
  margin-left: 9px;
`;

const UserName = styled.p`
  ${(props) => props.theme.fonts.semiBold18};
  color: ${theme.colors.gray800};
  margin-bottom: 3px;
  cursor: pointer;
`;

const OnlineStatus = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray600};
  cursor: default;
  @media (max-width: ${theme.breakpoints.mobile}) {
    text-align: left;
  }
`;

const ThreeDotsButton = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
