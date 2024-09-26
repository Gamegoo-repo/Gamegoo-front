import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { Chat } from "@/interface/chat";
import MoreBox from "../common/MoreBox";
import { useDispatch, useSelector } from "react-redux";
import { closeChatRoom } from "@/redux/slices/chatSlice";
import { getProfileBgColor } from "@/utils/profile";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { cancelFriendReq, deleteFriend, reqFriend } from "@/api/friends";
import { useState } from "react";
import { setOpenModal } from "@/redux/slices/modalSlice";

interface MessageHeaderProps {
    isMoreBoxOpen: boolean;
    setIsMoreBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
    chatEnterData?: Chat;
}

const MessageHeader = (props: MessageHeaderProps) => {
    const { isMoreBoxOpen, setIsMoreBoxOpen, chatEnterData } = props;

    const dispatch = useDispatch();
    const router = useRouter();

    const [dataUpdated, setDataUpdated] = useState(false);

    const onlineFriends = useSelector((state: RootState) => state.chat.onlineFriends);

    /* 친구 추가 */
    const handleFriendAdd = async () => {
        if (!chatEnterData) return;
        try {
            await reqFriend(chatEnterData.memberId);
            triggerDataUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    /* 친구 요청 취소 */
    const handleCancelFriendReq = async () => {
        if (!chatEnterData) return;

        try {
            await cancelFriendReq(chatEnterData.memberId);
            triggerDataUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    /* 친구 취소 */
    const handleFriendDelete = async () => {
        if (!chatEnterData) return;

        try {
            await deleteFriend(chatEnterData.memberId);
            triggerDataUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    /* 모달 타입 변경 */
    const handleModalChange = (e: React.MouseEvent, modalType: string, memberId?: number) => {
        if (modalType) {
            e.stopPropagation();
        }

        // if (memberId !== undefined) {
        //     onMemberId(memberId);
        // }

        dispatch(setOpenModal(modalType));
        setIsMoreBoxOpen(false);
    };

    /* 신고하기 */
    const handleReportClick = (e: React.MouseEvent, memberId: number) => {
        if (chatEnterData?.memberId) {
            handleModalChange(e, 'report', memberId);
        }
    };

    /* 매너 평가하기 */
    const handleMannerClick = (e: React.MouseEvent, targetMemberId: number) => {
        if (chatEnterData?.memberId) {
            handleModalChange(e, 'manner', targetMemberId);
        }
    };

    /* 비매너 평가하기 */
    const handleBadMannerClick = (e: React.MouseEvent, targetMemberId: number) => {
        if (chatEnterData?.memberId) {
            handleModalChange(e, 'badManner', targetMemberId);
        }
    };

    /* 더보기 버튼 */
    const menuItems: MoreBoxMenuItems[] = [
        { text: '채팅방 나가기', onClick: (e: React.MouseEvent) => handleModalChange(e, 'leave') },
        // 친구 추가 조건: 친구가 아니고, 친구 요청도 하지 않은 경우
        !chatEnterData?.friend && !chatEnterData?.friendRequestMemberId &&
        { text: '친구 추가', onClick: handleFriendAdd },
        // 친구 취소 조건: 친구인 경우
        chatEnterData?.friend &&
        { text: '친구 취소', onClick: handleFriendDelete },
        // 친구 요청 취소 조건: 친구가 아니고, 친구 요청을 이미 한 경우
        !chatEnterData?.friend && chatEnterData?.friendRequestMemberId &&
        { text: '친구 요청 취소', onClick: handleCancelFriendReq },
        { text: '차단하기', onClick: (e: React.MouseEvent) => handleModalChange(e, 'block') },
        { text: '신고하기', onClick: (e: React.MouseEvent) => chatEnterData?.memberId && handleReportClick(e, chatEnterData.memberId) },
        { text: '매너 평가', onClick: (e: React.MouseEvent) => chatEnterData?.memberId && handleMannerClick(e, chatEnterData.memberId) },
        { text: '비매너 평가', onClick: (e: React.MouseEvent) => chatEnterData?.memberId && handleBadMannerClick(e, chatEnterData.memberId) },
    ].filter(item => item) as MoreBoxMenuItems[];

    const triggerDataUpdate = () => {
        setDataUpdated((prev) => !prev);
    };

    return (
        <>
            {isMoreBoxOpen &&
                <MoreBox
                    items={menuItems}
                    top={35}
                    left={200}
                />
            }
            <CloseButton>
                <CloseImage
                    onClick={() => dispatch(closeChatRoom())}
                    src='/assets/icons/close.svg'
                    width={11}
                    height={11}
                    alt='닫기' />
            </CloseButton>
            {chatEnterData &&
                <ChatHeader>
                    <PrevImage
                        onClick={() => dispatch(closeChatRoom())}
                        src="/assets/icons/left_arrow.svg"
                        width={9}
                        height={18}
                        alt="뒤로가기" />
                    <Middle>
                        <ImageWrapper $bgColor={getProfileBgColor(chatEnterData.memberProfileImg)}>
                            <ProfileImage
                                onClick={() => router.push(`/user/${chatEnterData.memberId}`)}
                                src={`/assets/images/profile/profile${chatEnterData.memberProfileImg}.svg`}
                                width={38}
                                height={38}
                                alt="프로필 이미지" />
                        </ImageWrapper>
                        <Div>
                            <UserName>{chatEnterData.gameName}</UserName>
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
                        // onClick={handleMoreBoxOpen}
                        src="/assets/icons/three_dots_button.svg"
                        width={3}
                        height={15}
                        alt="상세보기" />
                </ChatHeader>
            }
        </>
    )
};

export default MessageHeader;

const CloseButton = styled.p`
    display:flex;
    margin-bottom:1px;
    padding:12px 13px 0 0;
`;

const CloseImage = styled(Image)`
    margin-left:auto;
    cursor: pointer;
`;

const ChatHeader = styled.header`
    display: flex;
    align-items: center;
    padding:11px 27px 20px 12px;
`;

const PrevImage = styled(Image)`
    margin-right:18px;
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

const ProfileImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
`;

const ThreeDotsImage = styled(Image)`
    cursor: pointer;
`;

const Div = styled.div`
    position: relative;
    margin-left:9px;
`;

const UserName = styled.p`
    ${(props) => props.theme.fonts.semiBold18};
    color: ${theme.colors.gray600}; 
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