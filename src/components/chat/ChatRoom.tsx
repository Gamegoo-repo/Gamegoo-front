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

interface ChatRoomProps {
    onClose: () => void;
    onGoback: () => void;
    chatData: Chat | undefined;
}

const ChatRoom = (props: ChatRoomProps) => {
    const { onClose, onGoback, chatData } = props;

    const dispatch = useDispatch();
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    const isEvaluationModalOpen = useSelector((state: RootState) => state.modal.evaluationModal);
    const isMannerStatus = useSelector((state: RootState) => state.mannerStatus.mannerStatus);

    // useEffect(() => {
    //     socket.on(“message”, (message) => {
    //     setMessageList((prevState)=> prevState.concat(message));
    // });
    // },[]);

    // useEffect(() => {
    //     const handleFetchChatData = async () => {
    //         try {
    //             if (typeof id === 'string') {
    //                 const data = await enterUsingUuid(id);
    //                 setChatData(data.result);
    //             }
    //             if (typeof id === 'number') {
    //                 const data = await enterUsingMemberId(id);
    //                 setChatData(data.result);
    //             }
    //         } catch (error) {
    //             console.error("에러:", error);
    //         }
    //     };

    //     handleFetchChatData();
    // }, [])

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

    const handleModalChange = (e: React.MouseEvent, modalType: string) => {
        e.stopPropagation();

        dispatch(setOpenModal(modalType));
        setIsMoreBoxOpen(false);
    };

    const handleFormModalClose = () => {
        setCheckedItems([]);
        dispatch(setCloseEvaluationModal());
    };

    const handleFriendAdd = () => {
        setIsMoreBoxOpen(false);
        console.log('친구 추가')
    };

    const menuItems: MoreBoxMenuItems[] = [
        { text: '채팅방 나가기', onClick: (e) => handleModalChange(e, 'leave') },
        { text: '친구 추가', onClick: handleFriendAdd },
        { text: '차단하기', onClick: (e) => handleModalChange(e, 'block') },
        { text: '신고하기', onClick: (e) => handleModalChange(e, 'report') },
        { text: '매너 평가', onClick: (e) => handleModalChange(e, 'manner') },
        { text: '비매너 평가', onClick: (e) => handleModalChange(e, 'badManner') },
    ];

    const handleCheckboxChange = (checked: number) => {
        setCheckedItems((prev) =>
            prev.includes(checked) ? prev.filter((c) => c !== checked) : [...prev, checked]
        );
    };

    return (
        <>
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
                            <Form onSubmit={sendMessage}>
                                <Textarea
                                    maxLength={1000}
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                />
                                <SubmitButton
                                    disabled={message === ""}
                                    type="submit"
                                    className="send-button"
                                >
                                    전송
                                </SubmitButton>
                            </Form>
                        </TextareaContainer>
                    </ChatFooter>
                </Wrapper>
            </Overlay>

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

