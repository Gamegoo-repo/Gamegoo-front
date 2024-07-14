import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import FriendsList from "./FriendsList";
import ChatList from "./ChatList";
import { useState } from "react";
import ChatRoom from "./ChatRoom";
import { useDispatch, useSelector } from "react-redux";
import { setCloseMoreModal, setOpenMoreModal } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import ConfirmModal from "../common/ConfirmModal";
import FormModal from "../common/FormModal";
import Checkbox from "../common/Checkbox";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import { REPORT_REASON } from "@/data/report";
import Input from "../common/Input";

interface ChatWindowProps {
    onClose: () => void;
}

const FRIENDS = [
    { id: 1, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 1 },
    { id: 2, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 0 },
    { id: 3, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 1 },
    { id: 4, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 0 },
    { id: 5, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 1 },
    { id: 6, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 1 },
    { id: 7, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 0 },
    { id: 8, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 0 },
    { id: 9, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 1 },
    { id: 10, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 0 },
    { id: 11, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 1 },
    { id: 12, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 0 },
    { id: 13, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 0 },
];

const CHAT = [
    { id: 1, image: "/assets/icons/gray_circle.svg", userName: "김철수", msg: '마지막 메시지', date: "2024-07-06 16:07" },
    { id: 2, image: "/assets/icons/gray_circle.svg", userName: "김철수", msg: '마지막 메시지', date: "2024-07-06 01:27" },
    { id: 3, image: "/assets/icons/gray_circle.svg", userName: "김철수", msg: '마지막 메시지', date: "2024-07-05 13:27" },
    { id: 4, image: "/assets/icons/gray_circle.svg", userName: "김철수", msg: '마지막 메시지', date: "2024-05-19 11:27" },
];

const ChatWindow = ({ onClose }: ChatWindowProps) => {

    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState<string>('friends');
    const [isChatRoomVisible, setIsChatRoomVisible] = useState(false);
    const [isMoreBoxOpen, setIsMoreBoxOpen] = useState<number | null>(null);
    const [chatId, setChatId] = useState<number | null>(null);
    const [reportDetail, setReportDetail] = useState<string>("");

    const isMoreModalType = useSelector((state: RootState) => state.modal.moreModal);

    const handleGoToChatRoom = (id: number) => {
        setChatId(id);
        setIsChatRoomVisible(true);
    };

    const handleBackToChatWindow = () => {
        setIsChatRoomVisible(false);
    };

    const handleModalChange = (modalType: string) => {
        dispatch(setOpenMoreModal(modalType));
        setIsMoreBoxOpen(null);
    };

    const handleModalClose = () => {
        dispatch(setCloseMoreModal());
    };

    const handleChatLeave = () => {
        console.log('채팅창 나가기')
        handleModalClose();
        handleBackToChatWindow();
    };

    const handleChatBlock = () => {
        handleBackToChatWindow();
        handleModalClose();
        dispatch(setOpenMoreModal('doneBlock'));
    };

    const handleOutsideModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (isMoreBoxOpen) {
            setIsMoreBoxOpen(null);
        }
    };

    return (
        <>
            <Overlay>
                <Wrapper onClick={handleOutsideModalClick}>
                    <ChatHeader>
                        <CloseButton>
                            <CloseImage
                                onClick={onClose}
                                src='/assets/icons/close.svg'
                                width={11}
                                height={11}
                                alt='close button' />
                        </CloseButton>
                        <HeaderTitle>메신저</HeaderTitle>
                        <TabContainer>
                            <Tab $isActive={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>
                                친구 목록
                            </Tab>
                            <Tab $isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
                                대화방
                            </Tab>
                        </TabContainer>
                    </ChatHeader>
                    {activeTab === 'friends' &&
                        <ChatSearch>
                            <SearchWrapper>
                                <SearchImage
                                    src="/assets/icons/search.svg"
                                    width={17}
                                    height={16}
                                    alt="검색하기" />
                                <SearchInput type="text" placeholder="친구 검색하기" />
                            </SearchWrapper>
                        </ChatSearch>
                    }
                    <ChatMain className={activeTab === 'friends' ? 'friends' : 'chat'}>
                        <Content className={activeTab === 'friends' ? 'friends' : 'chat'}>
                            {activeTab === 'friends' &&
                                <div>
                                    <FriendsList
                                        onChatRoom={handleGoToChatRoom}
                                        list={FRIENDS}
                                    />
                                </div>
                            }
                            {activeTab === 'chat' &&
                                <ChatList
                                    list={CHAT}
                                    setIsMoreBoxOpen={setIsMoreBoxOpen}
                                    isMoreBoxOpen={isMoreBoxOpen}
                                    onModalChange={handleModalChange}
                                    onChatRoom={handleGoToChatRoom}
                                />}
                        </Content>
                    </ChatMain>
                </Wrapper>
            </Overlay>

            {isChatRoomVisible && chatId !== null &&
                <ChatRoom
                    onClose={onClose}
                    onGoback={handleBackToChatWindow}
                    id={chatId} />
            }

            {/* 채팅창 나가기 팝업 */}
            {isMoreModalType === 'leave' &&
                <ConfirmModal
                    width="540px"
                    primaryButtonText="취소"
                    secondaryButtonText="나가기"
                    onPrimaryClick={handleModalClose}
                    onSecondaryClick={handleChatLeave}
                >
                    {/* 친구아닐떄 */}
                    <Text>
                        {`친구 추가 하지 않은 상대방입니다\n채팅방을 나가시겠어요?`}
                    </Text>

                    {/* 친구일떄 */}
                    {/* <Text>
                        {`채팅방을 나가시겠어요?`}
                    </Text> */}
                </ConfirmModal>}

            {/* 차단하기 팝업 */}
            {isMoreModalType === 'block' &&
                <ConfirmModal
                    width="540px"
                    primaryButtonText="취소"
                    secondaryButtonText="차단"
                    onPrimaryClick={handleModalClose}
                    onSecondaryClick={handleChatBlock}
                >
                    {/* 친구아닐떄 */}
                    <Text>
                        {`차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다.\n\n또한, 다시 차단 해제할 수 없습니다.\n차단하시겠습니까?`}
                    </Text>

                    {/* 친구일떄 */}
                    {/* <Text>
                     {`채팅방을 나가시겠어요?`}
                 </Text> */}
                </ConfirmModal>}

            {/* 차단 완료 팝업 */}
            {isMoreModalType === 'doneBlock' && (
                <ConfirmModal
                    width="540px"
                    primaryButtonText="확인"
                    onPrimaryClick={handleModalClose}
                >
                    <MsgConfirm>{`차단이 완료되었습니다.`}</MsgConfirm>
                </ConfirmModal>
            )}

            {/* 신고하기 팝업 */}
            {isMoreModalType === 'report' &&
                <FormModal
                    type="checkbox"
                    title="유저 신고하기"
                    width="494px"
                    height="721px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="20px"
                    buttonText="신고하기"
                    onClose={handleModalClose}
                >
                    <div>
                        <ReportLabel>신고 사유</ReportLabel>
                        <ReportReasonContent>
                            {REPORT_REASON.map((data) => (
                                <Checkbox
                                    key={data.id}
                                    value={data.text}
                                    label={data.text}
                                    fontSize="regular18"
                                />
                            ))}
                        </ReportReasonContent>
                        <ReportLabel>상세 내용</ReportLabel>
                        <ReportContent>
                            <Input
                                inputType="textarea"
                                value={reportDetail}
                                onChange={(value) => {
                                    setReportDetail(value);
                                }}
                                placeholder="내용을 입력하세요. (선택)"
                                borderRadius="8px"
                                fontSize="regular18"
                                height="134px"
                            />
                        </ReportContent>
                    </div>
                </FormModal>}

            {/* 매너평가 팝업 */}
            {isMoreModalType === 'manner' &&
                <FormModal
                    type="checkbox"
                    title="매너 평가하기"
                    width="418px"
                    height="434px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="10px"
                    buttonText="완료"
                    onClose={handleModalClose}
                >
                    <CheckContent>
                        {isMoreModalType === "manner" && MANNER_TYPES.map((data) => (
                            <Checkbox
                                key={data.id}
                                value={data.text}
                                label={data.text}
                                fontSize="semiBold16"
                            />
                        ))}
                    </CheckContent>
                </FormModal>}

            {/* 비매너 평가 팝업 */}
            {isMoreModalType === 'badManner' &&
                <FormModal
                    type="checkbox"
                    title="비매너 평가하기"
                    width="418px"
                    height="434px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="10px"
                    buttonText="완료"
                    onClose={handleModalClose}
                >
                    <CheckContent>
                        {isMoreModalType === "badManner" && BAD_MANNER_TYPES.map((data) => (
                            <Checkbox
                                key={data.id}
                                value={data.text}
                                label={data.text}
                                fontSize="semiBold16"
                            />
                        ))}
                    </CheckContent>
                </FormModal>}
        </>
    )
};

export default ChatWindow;

const Overlay = styled.div`
    position:fixed;
    top: 50%;
    right: 8%;
    transform: translate(0, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    background: ${theme.colors.white};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: 418px;
    box-shadow: 0 4px 46.7px 0 #0000001A;
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
    border-radius: 20px 20px 0 0;
    background: ${theme.colors.white};
    box-shadow: 0 -1px 10.7px 0 #00000026;
`;

const HeaderTitle = styled.p`
    padding: 0 30px;
    ${(props) => props.theme.fonts.bold20};
    color:${theme.colors.gray600};
    margin-bottom: 38px;
`;

const TabContainer = styled.div`
    display: flex;
    gap:40px;
    padding: 0 30px;
`;

const Tab = styled.div<{ $isActive: boolean }>`
    position: relative;
    padding: 4px 0;
    cursor: pointer;
    ${(props) => props.theme.fonts.semiBold14};
    color: #232323;
    &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -2px;
        width: ${(props) => (props.$isActive ? '100%' : 'none')};
        height: 4px;
        background-color: ${theme.colors.purple100}; 
        border-radius: 60px;
        transform: translateX(-50%);
        transition: width 0.3s ease;
    }
`;

const ChatSearch = styled.div`
    padding:15px 18px 11px;
    border-bottom: 1px solid ${theme.colors.gray400};
`;

const SearchWrapper = styled.div`
    position: relative;
    width:100%;
`;

const SearchImage = styled(Image)`
    position : absolute;
    top: 13px;
    left: 15px;
    margin: 0;
`;

const SearchInput = styled.input`
    width: 100%;
    background: ${theme.colors.gray500};
    border: 1px solid ${theme.colors.gray500};
    border-radius: 10px;
    padding: 10px 15px 10px 47px;
    ${(props) => props.theme.fonts.regular14};
    color:${theme.colors.gray200};
`;

const ChatMain = styled.div`
    border-radius: 0 0 20px 20px;
    background:${theme.colors.white};
    &.friends{
        box-shadow: none;
        padding:11px 6px 0 0;
    }
    &.chat{
        box-shadow: inset 0 0px 4.7px 0 #00000026;
    }
`;

const Content = styled.main`
    &.friends{
        height: 508px; 
    }
    &.chat{
        height: 590px; 
    }

    overflow-y: auto; 
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 66px;
        background: ${theme.colors.gray300};
    }
    &::-webkit-scrollbar-track {
        border-radius: 66px;
        background: transparent;
    }
`;

const CheckContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ReportLabel = styled.p`
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.semiBold18};
  margin-bottom: 12px;
`;

const ReportContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ReportReasonContent = styled(ReportContent)`
  margin-bottom: 38px;
`;

const Text = styled.div`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular18};
  margin: 28px 0;
`;

const MsgConfirm = styled(Text)`
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;
`;



