import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useState } from "react";
import MessageContainer from "./MessageContainer";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import FormModal from "../common/FormModal";
import Checkbox from "../common/Checkbox";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";

interface ChatRoomProps {
    id: number;
    onClose: () => void;
    onGoback: () => void;
}

const MESSAGE_LIST = [
    { user: "me", msg: '안녕하세요 저는 안녕하세요 저는 안녕하세요 저는', msgId: 1, userId: 1, date: "2024-05-01T23:25:00" },
    { user: "me", msg: '텍스트 텍스', msgId: 2, userId: 1, date: "2024-05-11T23:27:00" },
    { user: "you", msg: '아 네, 안녕하세요 하이하이라라', msgId: 3, userId: 2, date: "2024-07-02T01:08:00" },
    { user: "you", msg: '하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라', msgId: 4, userId: 2, date: "2024-07-02T01:11:00" },
    { user: "me", msg: '안녕하세요 저는 안녕하세요 저는 안녕하세요 저는22', msgId: 5, userId: 1, date: "2024-07-02T23:27:00" },
    { user: "me", msg: '텍스트 텍스22', msgId: 6, userId: 1, date: "2024-07-02T23:27:00" },
    { user: "you", msg: '아 네, 안녕하세요 하이하이라라22', msgId: 7, userId: 2, date: "2024-07-04T22:52:00" },
    { user: "you", msg: '하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라22', msgId: 8, userId: 2, date: "2024-07-04T22:52:00" },
];

const ChatRoom = (props: ChatRoomProps) => {
    const { id, onClose, onGoback } = props;

    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const isEvaluationModalOpen = useSelector((state: RootState) => state.confirmModal.evaluationModal);
    const isFeedbackModalOpen = useSelector((state: RootState) => state.confirmModal.isOpen);
    const isMannerStatus = useSelector((state: RootState) => state.mannerStatus.mannerStatus);

    // useEffect(() => {
    //     socket.on(“message”, (message) => {
    //     setMessageList((prevState)=> prevState.concat(message));
    // });
    // },[]);

    const sendMessage = (event: any) => {
        event.preventDefault();
        // socket.emit(“sendMessage”, message, (res) => {
        //     console.log(“res”, res);
        // })
        console.log(message)
    };

    return (
        <>
            <Overlay>
                <Wrapper $isFeedbackModalOpen={isFeedbackModalOpen}>
                    <CloseButton>
                        <CloseImage
                            onClick={onClose}
                            src='/assets/icons/close.svg'
                            width={11}
                            height={11}
                            alt='닫기' />
                    </CloseButton>
                    <ChatHeader>
                        <PrevImage
                            onClick={onGoback}
                            src="/assets/icons/left_arrow.svg"
                            width={9}
                            height={18}
                            alt="뒤로가기" />
                        <Middle>
                            <ProfileImage
                                src="/assets/icons/gray_circle.svg"
                                width={47.43}
                                height={47.43}
                                alt="프로필 이미지" />
                            <Div>
                                <UserName>김철수</UserName>
                                <Online>온라인</Online>
                                <OnlineImage
                                    src="/assets/icons/online.svg"
                                    width={5}
                                    height={5}
                                    alt="온라인" />
                            </Div>
                        </Middle>
                        <DetailImage
                            src="/assets/icons/three_dots_button.svg"
                            width={3}
                            height={15}
                            alt="상세보기" />
                    </ChatHeader>
                    <ChatBorder>
                        <ChatMain>
                            <System>매칭이 이루어졌어요 !</System>
                            <MessageContainer
                                messageList={MESSAGE_LIST} />
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
                {isEvaluationModalOpen &&
                    <FormModal
                        type="checkbox"
                        title={isMannerStatus === "manner" ? "매너 평가하기" : "비매너 평가하기"}
                        width="418px"
                        height="434px"
                        closeButtonWidth={17}
                        closeButtonHeight={17}
                        borderRadius="10px"
                        buttonText="완료"
                        disabled
                    >
                        <CheckContent>
                            {isMannerStatus === "manner" && MANNER_TYPES.map((data) => (
                                <Checkbox
                                    key={data.id}
                                    value={data.text}
                                    label={data.text}
                                    fontSize="semiBold16"
                                />
                            ))}
                        </CheckContent>
                        <CheckContent>
                            {isMannerStatus === "badManner" && BAD_MANNER_TYPES.map((data) => (
                                <Checkbox
                                    key={data.id}
                                    value={data.text}
                                    label={data.text}
                                    fontSize="semiBold16"
                                />
                            ))}
                        </CheckContent>
                    </FormModal>
                }
            </Overlay>
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

const Wrapper = styled.div<{ $isFeedbackModalOpen: boolean }>`
    background: ${theme.colors.purple400};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: 418px;
    &:before {
        content: '';
        position: ${({ $isFeedbackModalOpen }) => $isFeedbackModalOpen ? 'fixed' : 'unset'};
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${({ $isFeedbackModalOpen }) => $isFeedbackModalOpen ? '#0000009C' : 'transparent'};
        z-index: 100;
        border-radius: 20px;
    }
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
    height: 476px;
    overflow-y: auto;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
    display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const System = styled.p`
    width: 100%;
    text-align: center;
    padding:11px 0px;
    background: #000000A3;
    ${(props) => props.theme.fonts.regular12};
    color: ${theme.colors.white}; 
    border-radius: 14px;
    margin-bottom: 11px;
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

const ProfileImage = styled(Image)`
    cursor: pointer;
`;

const DetailImage = styled(Image)`
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






