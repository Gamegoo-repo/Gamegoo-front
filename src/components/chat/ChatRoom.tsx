import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
import MessageContainer from "./MessageContainer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import FormModal from "../common/FormModal";
import Checkbox from "../common/Checkbox";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import { setCloseEvaluationModal, setOpenModal } from "@/redux/slices/modalSlice";
import { useRouter } from "next/navigation";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import MoreBox from "../common/MoreBox";
import Button from "../common/Button";
import { Chat } from "@/interface/chat";
import { getProfileBgColor } from "@/utils/profile";
import { cancelFriendReq, deleteFriend, reqFriend } from "@/api/friends";
import { enterUsingMemberId, enterUsingUuid } from "@/api/chat";
import { getBadMannerValues, getMannerValues } from "@/api/manner";
import { Mannerstatus } from "@/interface/manner";
import { setCurrentChatUuid } from "@/redux/slices/chatSlice";

interface ChatRoomProps {
    onClose: () => void;
    onGoback: () => void;
    chatId: string | number | undefined;
    onMemberId: (id: number) => void;
    onMannerEdit: (type: string) => void;
    onMannerCheckboxChange: (checked: number) => void;
    onBadMannerCheckboxChange: (checked: number) => void;
    onMannerPost: () => void;
    onBadMannerPost: () => void;
}

const ChatRoom = (props: ChatRoomProps) => {
    const {
        onClose,
        onGoback,
        chatId,
        onMemberId,
        onMannerEdit,
        onMannerCheckboxChange,
        onBadMannerCheckboxChange,
        onMannerPost,
        onBadMannerPost
    } = props;

    const dispatch = useDispatch();
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
    const [dataUpdated, setDataUpdated] = useState(false);
    const [checkedMannerItems, setCheckedMannerItems] = useState<number[]>([]);
    const [checkedBadMannerItems, setCheckedBadMannerItems] = useState<number[]>([]);
    const [isMannerStatus, setIsMannerStatus] = useState<Mannerstatus | undefined>();
    const [isBadMannerStatus, setIsBadMannerStatus] = useState<Mannerstatus | undefined>();
    const [chatEnterData, setChatEnterData] = useState<Chat>();

    const isEvaluationModalOpen = useSelector((state: RootState) => state.modal.evaluationModal);
    const isMannerModalStatus = useSelector((state: RootState) => state.mannerStatus.mannerStatus);
    const onlineFriends = useSelector((state: RootState) => state.chat.onlineFriends);


    /* 채팅방 입장 */
    useEffect(() => {
        const handleChatEnter = async () => {
            try {
                if (typeof chatId === 'string') {
                    const data = await enterUsingUuid(chatId);
                    setChatEnterData(data.result);
                    onMemberId(data.result.memberId);
                    dispatch(setCurrentChatUuid(data.result.uuid));
                }
                if (typeof chatId === 'number') {
                    const data = await enterUsingMemberId(chatId);
                    setChatEnterData(data.result);
                    onMemberId(data.result.memberId);
                    dispatch(setCurrentChatUuid(data.result.uuid));
                }
            } catch (error) {
                console.error(error);
            }
        };

        handleChatEnter();
    }, [chatId, dataUpdated])


    const triggerDataUpdate = () => {
        setDataUpdated((prev) => !prev);
    };

    const sendMessage = (event: any) => {
        event.preventDefault();
        // socket.emit(“sendMessage”, message, (res) => {
        //     console.log(“res”, res);
        // })
        setMessage("");
        console.log(message)
    };

    const handleMoreBoxOpen = () => {
        if (!chatEnterData || !chatEnterData.memberId) return;

        handleMannerValuesGet(chatEnterData.memberId);
        handleBadMannerValuesGet(chatEnterData.memberId);
        setIsMoreBoxOpen(prevState => !prevState);
    };

    const handleOutsideModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (isMoreBoxOpen) {
            setIsMoreBoxOpen(false);
        }
    };

    /* 모달 타입 변경 */
    const handleModalChange = (e: React.MouseEvent, modalType: string, memberId?: number) => {
        if (modalType) {
            e.stopPropagation();
        }

        if (memberId !== undefined) {
            onMemberId(memberId);
        }

        dispatch(setOpenModal(modalType));
        setIsMoreBoxOpen(false);
    };

    /* 신고하기 */
    const handleReportClick = (e: React.MouseEvent, memberId: number) => {
        if (chatEnterData?.memberId) {
            handleModalChange(e, 'report', memberId);
        }
    }

    const handleFormModalClose = () => {
        setCheckedMannerItems([]);
        setCheckedBadMannerItems([]);
        dispatch(setCloseEvaluationModal());
    };

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

    /* 매너평가 조회 */
    const handleMannerValuesGet = async (memberId: number) => {
        try {
            const response = await getMannerValues(memberId);
            await setIsMannerStatus(response.result);
        } catch (error) {
            console.error(error);
        }
    };

    /* 비매너평가 조회 */
    const handleBadMannerValuesGet = async (memberId: number) => {
        try {
            const response = await getBadMannerValues(memberId);
            await setIsBadMannerStatus(response.result);
            console.log(response.result)
        } catch (error) {
            console.error(error);
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

    return (
        <>
            {chatEnterData &&
                <Overlay>
                    <Wrapper onClick={handleOutsideModalClick}>
                        {isMoreBoxOpen &&
                            <MoreBox
                                items={menuItems}
                                top={35}
                                left={200}
                            />
                        }
                        <CloseButton>
                            <CloseImage
                                onClick={onClose}
                                src='/assets/icons/close.svg'
                                width={11}
                                height={11}
                                alt='닫기' />
                        </CloseButton>
                        {chatEnterData &&
                            <ChatHeader>
                                <PrevImage
                                    onClick={onGoback}
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
                                    onClick={handleMoreBoxOpen}
                                    src="/assets/icons/three_dots_button.svg"
                                    width={3}
                                    height={15}
                                    alt="상세보기" />
                            </ChatHeader>
                        }
                        <ChatBorder>
                            <ChatMain>
                                {chatEnterData &&
                                    <MessageContainer
                                        chatEnterData={chatEnterData} />
                                }
                            </ChatMain>
                        </ChatBorder>
                        <ChatFooter>
                            <TextareaContainer>
                                <Form
                                    onSubmit={sendMessage}>
                                    <Textarea
                                        maxLength={1000}
                                        value={message}
                                        onChange={(event) => setMessage(event.target.value)}
                                        disabled={!!chatEnterData.blocked}
                                        placeholder={!!chatEnterData?.blocked ? "메시지를 보낼 수 없는 상대입니다." : ""}
                                    />
                                    <SubmitButton
                                        disabled={message === "" || !!chatEnterData.blocked}
                                        type="submit"
                                        className={!!chatEnterData.blocked ? "disabled-button" : ""}
                                    >
                                        전송
                                    </SubmitButton>
                                </Form>
                            </TextareaContainer>
                        </ChatFooter>
                    </Wrapper>
                </Overlay>
            }

            {isEvaluationModalOpen && isMannerModalStatus === "manner" &&
                <FormModal
                    type="checkbox"
                    title={isMannerStatus?.isExist ? "내가 남긴 매너 평가" : "매너 평가하기"}
                    width="418px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="10px"
                    onClose={handleFormModalClose}
                    disabled
                >
                    <CheckContent>
                        {isMannerModalStatus === "manner" && MANNER_TYPES.map((data) => (
                            <Checkbox
                                key={data.id}
                                value={data.id}
                                label={data.text}
                                fontSize="semiBold16"
                                isChecked={checkedMannerItems.includes(data.id)}
                                onArrayChange={onMannerCheckboxChange}
                            />
                        ))}
                    </CheckContent>
                    <ModalSubmitBtn>
                        <Button
                            onClick={() => isMannerStatus?.isExist ? onMannerEdit('manner') : onMannerPost()}
                            buttonType="primary"
                            text={isMannerStatus?.isExist ? "수정하기" : "완료"}
                            disabled={checkedMannerItems.length === 0}
                        />
                    </ModalSubmitBtn>
                </FormModal>
            }

            {isEvaluationModalOpen && isMannerModalStatus === "badManner" &&
                <FormModal
                    type="checkbox"
                    title={isBadMannerStatus?.isExist ? "내가 남긴 비매너 평가" : "비매너 평가하기"}
                    width="418px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="10px"
                    onClose={handleFormModalClose}
                    disabled
                >
                    <CheckContent>
                        {isMannerModalStatus === "badManner" && BAD_MANNER_TYPES.map((data) => (
                            <Checkbox
                                key={data.id}
                                value={data.id}
                                label={data.text}
                                fontSize="semiBold16"
                                isChecked={checkedBadMannerItems.includes(data.id)}
                                onArrayChange={onBadMannerCheckboxChange}
                            />
                        ))}
                    </CheckContent>
                    <ModalSubmitBtn>
                        <Button
                            onClick={() => isBadMannerStatus?.isExist ? onMannerEdit('badManner') : onBadMannerPost()}
                            buttonType="primary"
                            text={isBadMannerStatus?.isExist ? "수정하기" : "완료"}
                            disabled={checkedBadMannerItems.length === 0}
                        />
                    </ModalSubmitBtn>
                </FormModal>
            }
        </>
    )
};

export default ChatRoom;

const Overlay = styled.div`
    position:fixed;
    top: 50%;
    right: 8%;
    transform: translate(0, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    position: relative;
    background: ${theme.colors.purple400};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: 418px;
`;

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

const ChatBorder = styled.div`
    padding: 0 12px;
`;

const ChatMain = styled.main`
    border-top: 1px solid #C1B7FF;
    padding:10px 8px;
    height: 471px;
    overflow-y: auto;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
    display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const ChatFooter = styled.footer``;

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

const TextareaContainer = styled.div`
    position: relative;
    background: ${theme.colors.white};
    height: 138px;
    width: 100%;
    border-radius: 0 0 20px 20px;
`;

const Form = styled.form`
    height: 100%;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 4px 46.7px 0 #0000001A;
`;

const Textarea = styled.textarea`
    border:none;
    width: 100%;
    padding: 14px 17px;
    ${(props) => props.theme.fonts.regular14};
    color: ${theme.colors.gray600}; 
    resize: none; 
    &:focus{
    outline:none;
  }
  &:disabled {
    background-color: unset;
    &::placeholder {
      color: ${theme.colors.gray200}; 
    }
  }
`;

const SubmitButton = styled.button`
  position: absolute;
  right:20px;
  bottom: 19px;
  ${(props) => props.theme.fonts.semiBold15};
  color: ${theme.colors.white}; 
  background: ${theme.colors.purple100};
  border-radius: 25px;
  padding: 12px 20px;
  &.disabled-button{
    cursor: not-allowed;
  }
`;

const CheckContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ModalSubmitBtn = styled.div`
  margin-top:52px;
`;

