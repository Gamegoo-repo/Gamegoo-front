import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { Chat } from "@/interface/chat";
import MoreBox from "../common/MoreBox";
import { useDispatch, useSelector } from "react-redux";
import {
  closeChat,
  closeChatRoom,
  openChat,
  setChatRoomUuid,
} from "@/redux/slices/chatSlice";
import { getProfileBgColor } from "@/utils/profile";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import Alert from "../common/Alert";
import { useState } from "react";
import useMediaQueries from "@/hooks/useMediaQueries";

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

  const isMobile = useMediaQueries({ breakpoint: 700 });
  const dispatch = useDispatch();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState<boolean>(false);

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
      setShowAlert(true);
    } else {
      dispatch(setChatRoomUuid(null));
      dispatch(closeChatRoom());
      dispatch(openChat());
    }
  };

  const handleMoreBoxOpen = () => {
    if (disabled) {
      setShowAlert(true);
    } else {
      onMoreBoxOpen();
    }
  };

  return (
    <>
      {showAlert && (
        <Alert
          icon="exclamation"
          width={68}
          height={58}
          content="로그인이 필요한 서비스입니다."
          alt="경고"
          onClose={() => setShowAlert(false)}
          buttonText="확인"
        />
      )}
      {isMoreBoxOpen && (
        <MoreBox
          items={menuItems}
          top={35}
          right={30}
          onClose={() => setIsMoreBoxOpen(false)}
        />
      )}
      {!isMobile ? (
        <CloseButton>
          <CloseImage
            onClick={() => dispatch(closeChatRoom())}
            src="/assets/icons/close.svg"
            width={11}
            height={11}
            alt="닫기"
          />
        </CloseButton>
      ) : (
        <TitleWrap>
          <Title>채팅</Title>
          <CloseButton>
            <CloseImage
              onClick={() => dispatch(closeChatRoom())}
              src="/assets/icons/close_modal.svg"
              width={11}
              height={11}
              alt="닫기"
            />
          </CloseButton>
        </TitleWrap>
      )}

      {chatEnterData && (
        <ChatHeader>
          <PrevImage
            onClick={handleGoToPrevious}
            src="/assets/icons/chevron_left.svg"
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
              {chatEnterData?.friend && (
                <>
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
                </>
              )}
            </Div>
          </Middle>
          <ThreeDotsButton onClick={handleMoreBoxOpen}>
            <ThreeDotsImage
              src="/assets/icons/three_dots_button.svg"
              width={30}
              height={15}
              alt="상세보기"
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
  @media (max-width: 700px) {
    padding: 12px 16px;
  }
`;

const Title = styled.p`
  ${theme.fonts.bold20}
`;

const CloseButton = styled.p`
  display: flex;
  margin-bottom: 1px;
  padding: 12px 13px 0 0;
  @media (max-width: 700px) {
    padding: 0;
  }
`;

const CloseImage = styled(Image)`
  margin-left: auto;
  cursor: pointer;
`;

const ChatHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 11px 27px 20px 12px;
  @media (max-width: 700px) {
    padding: 12px 16px;
  }
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
  cursor: pointer;
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
  color: ${theme.colors.gray800};
  cursor: pointer;
`;

const OnlineStatus = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray600};
  cursor: default;
  @media (max-width: 700px) {
    text-align: left;
  }
`;

const OnlineImage = styled(Image)`
  position: absolute;
  top: 1%;
  right: -11%;
`;

const ThreeDotsButton = styled.button`
  width: 20px;
  height: 20px;
`;
