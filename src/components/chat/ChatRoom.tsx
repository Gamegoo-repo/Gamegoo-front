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

interface ChatRoomProps {
    onClose: () => void;
    onGoback: () => void;
    chatId: string | number | undefined;
    onMemberId: (id: number) => void;

}

const ChatRoom = (props: ChatRoomProps) => {
    const { onClose, onGoback, chatId, onMemberId } = props;

    const dispatch = useDispatch();
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [dataUpdated, setDataUpdated] = useState(false);

    const isEvaluationModalOpen = useSelector((state: RootState) => state.modal.evaluationModal);
    const isMannerStatus = useSelector((state: RootState) => state.mannerStatus.mannerStatus);

    // useEffect(() => {
    //     socket.on(“message”, (message) => {
    //     setMessageList((prevState)=> prevState.concat(message));
    // });
    // },[]);
    const [chatData, setChatData] = useState<Chat>();

    /* 채팅방 입장 */
    useEffect(() => {
        const handleFetchChatData = async () => {
            try {
                if (typeof chatId === 'string') {
                    const data = await enterUsingUuid(chatId);
                    setChatData(data.result);
                    onMemberId(data.result.memberId);
                }
                if (typeof chatId === 'number') {
                    const data = await enterUsingMemberId(chatId);
                    setChatData(data.result);
                    onMemberId(data.result.memberId);
                }
            } catch (error) {
                console.error("에러:", error);
            }
        };

        handleFetchChatData();
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
        e.stopPropagation();
console.log(memberId)
        // onModalChange(modalType, memberId);
        if (modalType === 'report' && memberId !== undefined) {
            onMemberId(memberId);
        }

        dispatch(setOpenModal(modalType));
        setIsMoreBoxOpen(false);
    };

    /* 신고하기 */
    const handleReportClick = (e: React.MouseEvent, memberId: number) => {
        if (chatData?.memberId) {
            handleModalChange(e, 'report', chatData.memberId);
        }
    }

    const handleFormModalClose = () => {
        setCheckedItems([]);
        dispatch(setCloseEvaluationModal());
    };

    /* 친구 추가 */
    const handleFriendAdd = async () => {
        if (!chatData) return;
        try {
            await reqFriend(chatData.memberId);
            triggerDataUpdate();
        } catch (error) {
            console.log('에러', error)
        }
    };

    /* 친구 요청 취소 */
    const handleCancelFriendReq = async () => {
        if (!chatData) return;

        try {
            await cancelFriendReq(chatData.memberId);
            triggerDataUpdate();
        } catch (error) {
            console.log('에러', error)
        }
    };

    /* 친구 취소 */
    const handleFriendDelete = async () => {
        if (!chatData) return;

        try {
            await deleteFriend(chatData.memberId);
            triggerDataUpdate();
        } catch (error) {
            console.log('에러', error)
        }
    };

    const menuItems: MoreBoxMenuItems[] = [
        { text: '채팅방 나가기', onClick: (e: React.MouseEvent) => handleModalChange(e, 'leave') },
        // 친구 추가 조건: 친구가 아니고, 친구 요청도 하지 않은 경우
        !chatData?.friend && !chatData?.friendRequestMemberId &&
        { text: '친구 추가', onClick: handleFriendAdd },
        // 친구 취소 조건: 친구인 경우
        chatData?.friend &&
        { text: '친구 취소', onClick: handleFriendDelete },
        // 친구 요청 취소 조건: 친구가 아니고, 친구 요청을 이미 한 경우
        !chatData?.friend && chatData?.friendRequestMemberId &&
        { text: '친구 요청 취소', onClick: handleCancelFriendReq },
        { text: '차단하기', onClick: (e: React.MouseEvent) => handleModalChange(e, 'block') },
        { text: '신고하기', onClick: (e: React.MouseEvent) => chatData?.memberId && handleReportClick(e, chatData.memberId) },
        { text: '매너 평가', onClick: (e: React.MouseEvent) => handleModalChange(e, 'manner') },
        { text: '비매너 평가', onClick: (e: React.MouseEvent) => handleModalChange(e, 'badManner') },
    ].filter(item => item) as MoreBoxMenuItems[];

    const handleCheckboxChange = (checked: number) => {
        setCheckedItems((prev) =>
            prev.includes(checked) ? prev.filter((c) => c !== checked) : [...prev, checked]
        );
    };

    return (
        <>
            {chatData &&
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
                        {chatData &&
                            <ChatHeader>
                                <PrevImage
                                    onClick={onGoback}
                                    src="/assets/icons/left_arrow.svg"
                                    width={9}
                                    height={18}
                                    alt="뒤로가기" />
                                <Middle>
                                    <ImageWrapper $bgColor={getProfileBgColor(chatData.memberProfileImg)}>
                                        <ProfileImage
                                            onClick={() => router.push("/user")}
                                            src={`/assets/images/profile/profile${chatData.memberProfileImg}.svg`}
                                            width={38}
                                            height={38}
                                            alt="프로필 이미지" />
                                    </ImageWrapper>
                                    <Div>
                                        <UserName>{chatData.gameName}</UserName>
                                        <Online>온라인</Online>
                                        <OnlineImage
                                            src="/assets/icons/online.svg"
                                            width={5}
                                            height={5}
                                            alt="온라인" />
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
                                {chatData &&
                                    <MessageContainer
                                        message={chatData} />
                                }
                            </ChatMain>
                        </ChatBorder>
                        <ChatFooter>
                            <TextareaContainer>
                                <Form
                                    onSubmit={sendMessage}
                                    className={!!chatData.blocked ? 'disabledInput' : ''}>
                                    <Textarea
                                        maxLength={1000}
                                        value={message}
                                        onChange={(event) => setMessage(event.target.value)}
                                        disabled={!!chatData.blocked}
                                        placeholder={!!chatData?.blocked ? "입력창 내 대화를 보낼 수 없는 상대입니다." : ""}
                                    />
                                    <SubmitButton
                                        disabled={message === "" || !!chatData.blocked}
                                        type="submit"
                                        className={!!chatData.blocked ? "disabled-button" : ""}
                                    >
                                        전송
                                    </SubmitButton>
                                </Form>
                            </TextareaContainer>
                        </ChatFooter>
                    </Wrapper>
                </Overlay>
            }

            {isEvaluationModalOpen && isMannerStatus === "manner" &&
                <FormModal
                    type="checkbox"
                    title="매너 평가하기"
                    width="418px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="10px"
                    onClose={handleFormModalClose}
                    disabled
                >
                    <CheckContent>
                        {isMannerStatus === "manner" && MANNER_TYPES.map((data) => (
                            <Checkbox
                                key={data.id}
                                value={data.id}
                                label={data.text}
                                fontSize="semiBold16"
                                isArraychecked={checkedItems.includes(data.id)}
                                onArrayChange={handleCheckboxChange}
                            />
                        ))}
                    </CheckContent>
                    <ModalSubmitBtn>
                        <Button
                            onClick={handleFormModalClose}
                            buttonType="primary"
                            text="완료"
                            disabled={checkedItems.length === 0}
                        />
                    </ModalSubmitBtn>
                </FormModal>
            }

            {isEvaluationModalOpen && isMannerStatus === "badManner" &&
                <FormModal
                    type="checkbox"
                    title="비매너 평가하기"
                    width="418px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="10px"
                    onClose={handleFormModalClose}
                    disabled
                >
                    <CheckContent>
                        {isMannerStatus === "badManner" && BAD_MANNER_TYPES.map((data) => (
                            <Checkbox
                                key={data.id}
                                value={data.text}
                                label={data.text}
                                fontSize="semiBold16"
                                isArraychecked={checkedItems.includes(data.id)}
                                onArrayChange={handleCheckboxChange}
                            />
                        ))}
                    </CheckContent>
                    <ModalSubmitBtn>
                        <Button
                            onClick={handleFormModalClose}
                            buttonType="primary"
                            text="완료"
                            disabled={checkedItems.length === 0}
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

const Online = styled.p`
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
    &.disabledInput {
        background:#000000A3;
        opacity: 0.3;
    }
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
      color: ${theme.colors.white}; 
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

