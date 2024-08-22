import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import FriendsList from "./FriendsList";
import ChatList from "./ChatList";
import { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import { useDispatch, useSelector } from "react-redux";
import { setCloseModal, setOpenModal } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import ConfirmModal from "../common/ConfirmModal";
import FormModal from "../common/FormModal";
import Checkbox from "../common/Checkbox";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import { REPORT_REASON } from "@/data/report";
import Input from "../common/Input";
import Button from "../common/Button";
import { editManners, postBadMannerValue, postMannerValue } from "@/api/manner";
import { getChatrooms, leaveChatroom } from "@/api/chat";
import { ChatroomList } from "@/interface/chat";
import { blockMember, reportMember } from "@/api/member";
import { Mannerstatus } from "@/interface/manner";

interface ChatWindowProps {
    onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {

    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState<string>('friends');
    const [isChatRoomVisible, setIsChatRoomVisible] = useState(false);
    const [isMoreBoxOpen, setIsMoreBoxOpen] = useState<number | null>(null);
    const [chatId, setChatId] = useState<string | number | undefined>();
    const [checkedReportItems, setCheckedReportItems] = useState<number[]>([]);
    const [checkedMannerItems, setCheckedMannerItems] = useState<number[]>([]);
    const [checkedBadMannerItems, setCheckedBadMannerItems] = useState<number[]>([]);
    const [reportDetail, setReportDetail] = useState<string>("");
    const [isMemberId, setIsMemberId] = useState<number>();
    const [isUuid, setIsUuid] = useState("");
    const [chatrooms, setChatrooms] = useState<ChatroomList[]>([]);
    const [selectedChatroom, setSelectedChatroom] = useState<ChatroomList | null>(null);
    const [reloadChatrooms, setReloadChatrooms] = useState(false);
    const [targetMemberId, setTargetMemberId] = useState<number | null>(null);
    const [isMannerStatus, setIsMannerStatus] = useState<Mannerstatus | undefined>();
    const [isBadMannerStatus, setIsBadMannerStatus] = useState<Mannerstatus | undefined>();

    const isModalType = useSelector((state: RootState) => state.modal.modalType);
    const isUser = useSelector((state: RootState) => state.user);

    /* 대화방 목록 가져오기  */
    useEffect(() => {
        const handleFetchChatrooms = async () => {
            try {
                const data = await getChatrooms();
                setChatrooms(data.result);
            } catch (error) {
                console.error("에러:", error);
            }
        };

        handleFetchChatrooms();
    }, [isModalType, reloadChatrooms])

    /* 상태 변경하여 useEffect 트리거 */
    const triggerReloadChatrooms = () => {
        setReloadChatrooms(prev => !prev);
    };

    /* 채팅방 입장 */
    const handleGoToChatRoom = (id: string | number) => {
        setChatId(id);
        setIsChatRoomVisible(true);
    };

    /* 채팅창 뒤로가기 */
    const handleBackToChatWindow = () => {
        setIsChatRoomVisible(false);
    };

    const handleMemberIdGet = (id: number) => {
        setIsMemberId(id);
        setTargetMemberId(id);
    }

    /* 모달 타입 변경 */
    const handleModalChange = async (modalType: string, targetMemberId?: number) => {
        if (targetMemberId !== undefined) {
            await setTargetMemberId(targetMemberId);
            setIsMemberId(targetMemberId);
        }

        dispatch(setOpenModal(modalType));
        setIsMoreBoxOpen(null);
    };

    /* 모달 닫기 */
    const handleModalClose = () => {
        setCheckedReportItems([]);
        setCheckedMannerItems([]);
        setCheckedBadMannerItems([]);
        setReportDetail("");
        dispatch(setCloseModal());
    };

    /* 채팅 uuid 가져오기 */
    const handleUuidGet = (uuid: string) => {
        setIsUuid(uuid);
    };

    /* 채팅방 나가기 */
    const handleChatLeave = async () => {
        try {
            await leaveChatroom(isUuid);
            await dispatch(setCloseModal());
        } catch (error) {
            console.error("에러:", error);
        }
        handleModalClose();
        handleBackToChatWindow();
    };

    /* 차단하기 */
    const handleChatBlock = async () => {
        if (!isMemberId) return;

        handleBackToChatWindow();
        handleModalClose();
        try {
            await blockMember(isMemberId);
            await dispatch(setCloseModal());
        } catch (error) {
            console.error("에러:", error);
        }
        await dispatch(setOpenModal('doneBlock'));
    };

    /* 더보기 버튼 외부 클릭 시 닫힘 */
    const handleOutsideModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (isMoreBoxOpen) {
            setIsMoreBoxOpen(null);
        }
    };

    /* 신고하기 체크박스 */
    const handleReportCheckboxChange = (checked: number) => {
        setCheckedReportItems((prev) =>
            prev.includes(checked) ? prev.filter((c) => c !== checked) : [...prev, checked]
        );
    };

    /* 매너 평가 체크박스 */
    const handleMannerCheckboxChange = (checked: number) => {
        setCheckedMannerItems((prev) =>
            prev.includes(checked) ? prev.filter((c) => c !== checked) : [...prev, checked]
        );
    };

    /* 비매너 평가 체크박스 */
    const handleBadMannerCheckboxChange = (checked: number) => {
        setCheckedBadMannerItems((prev) =>
            prev.includes(checked) ? prev.filter((c) => c !== checked) : [...prev, checked]
        );
    };

    /* 신고하기 */
    const handleReport = async () => {
        if (!targetMemberId) return;

        const params = {
            targetMemberId: targetMemberId,
            reportTypeIdList: checkedReportItems,
            contents: reportDetail
        };

        try {
            await reportMember(params)
            await handleModalClose();
        } catch (error) {
            console.error("에러:", error);
        }
    };

    /* 매너평가 등록 */
    const handleMannerPost = async () => {
        if (!targetMemberId) return;

        const params = {
            toMemberId: targetMemberId,
            mannerRatingKeywordList: checkedMannerItems,
        };

        try {
            await postMannerValue(params)
            await handleModalClose();
        } catch (error) {
            console.error("에러:", error);
        }
    };

    /* 비매너평가 등록 */
    const handleBadMannerPost = async () => {
        if (!targetMemberId) return;

        const params = {
            toMemberId: targetMemberId,
            mannerRatingKeywordList: checkedBadMannerItems,
        };

        try {
            await postBadMannerValue(params)
            await handleModalClose();
        } catch (error) {
            console.error("에러:", error);
        }
    };

    /* 기존 매너, 비매너 평가 내역 가져오기 */
    useEffect(() => {
        if (isModalType === 'manner' && isMannerStatus?.isExist && isMannerStatus.mannerRatingKeywordList) {
            setCheckedMannerItems(isMannerStatus.mannerRatingKeywordList);
        }
        if (isModalType === 'badManner' && isBadMannerStatus?.isExist && isBadMannerStatus.mannerRatingKeywordList) {
            setCheckedBadMannerItems(isBadMannerStatus.mannerRatingKeywordList);
        }
    }, [isModalType, isMannerStatus, isBadMannerStatus, isMoreBoxOpen]);

    /* 매너, 비매너 평가 수정 */
    const handleMannerEdit = async (type: string) => {
        const mannerId = localStorage.getItem('mannerId');
        const badMannerId = localStorage.getItem('badMannerId');

        if (!type || !mannerId || !badMannerId) return;

        const mannerIdNumber = parseInt(mannerId, 10);
        const badMannerIdNumber = parseInt(badMannerId, 10);

        const params = {
            mannerRatingKeywordList: type === 'manner' ? checkedMannerItems : checkedBadMannerItems,
        };

        try {
            await editManners(type === 'manner' ? mannerIdNumber : badMannerIdNumber, params);
            await handleModalClose();
        } catch (error) {
            console.log('에러', error);
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
                                <FriendsList
                                    onChatRoom={handleGoToChatRoom}
                                />
                            }
                            {activeTab === 'chat' && (
                                chatrooms?.length > 0 ? (
                                    <ChatList
                                        setIsMoreBoxOpen={setIsMoreBoxOpen}
                                        isMoreBoxOpen={isMoreBoxOpen}
                                        onModalChange={handleModalChange}
                                        onChatRoom={handleGoToChatRoom}
                                        isUuid={handleUuidGet}
                                        chatrooms={chatrooms}
                                        onSelectChatroom={setSelectedChatroom}
                                        triggerReloadChatrooms={triggerReloadChatrooms}
                                        setIsMannerStatus={setIsMannerStatus}
                                        setIsBadMannerStatus={setIsBadMannerStatus}
                                    />
                                ) : (
                                    <NoData>생성된 대화방이 없습니다.</NoData>
                                )
                            )}
                        </Content>
                    </ChatMain>
                </Wrapper>
            </Overlay>

            {isChatRoomVisible && chatId !== null &&
                <ChatRoom
                    onClose={onClose}
                    onGoback={handleBackToChatWindow}
                    chatId={chatId}
                    onMemberId={handleMemberIdGet}
                    onMannerEdit={handleMannerEdit}
                    onMannerCheckboxChange={handleMannerCheckboxChange}
                    onBadMannerCheckboxChange={handleBadMannerCheckboxChange}
                />
            }

            {/* 채팅창 나가기 팝업 */}
            {isModalType === 'leave' && selectedChatroom &&
                <ConfirmModal
                    width="540px"
                    primaryButtonText="취소"
                    secondaryButtonText="나가기"
                    onPrimaryClick={handleModalClose}
                    onSecondaryClick={handleChatLeave}
                >
                    {selectedChatroom.friend ? (
                        <Text>
                            {`채팅방을 나가시겠어요?`}
                        </Text>
                    ) : (
                        <Text>
                            {`친구 추가 하지 않은 상대방입니다\n채팅방을 나가시겠어요?`}
                        </Text>
                    )}

                </ConfirmModal>
            }

            {/* 차단하기 팝업 */}
            {isModalType === 'block' &&
                <ConfirmModal
                    width="540px"
                    primaryButtonText="취소"
                    secondaryButtonText="차단"
                    onPrimaryClick={handleModalClose}
                    onSecondaryClick={handleChatBlock}
                >
                    <div>
                        <Text>
                            {`차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다. 차단하시겠습니까?`}
                        </Text>
                        <SmallText>
                            {` 차단 해제는 마이페이지에서 가능합니다.`}
                        </SmallText>
                    </div>
                </ConfirmModal>
            }

            {/* 차단 완료 팝업 */}
            {isModalType === 'doneBlock' && (
                <ConfirmModal
                    width="540px"
                    primaryButtonText="확인"
                    onPrimaryClick={handleModalClose}
                >
                    <MsgConfirm>{`차단이 완료되었습니다.`}</MsgConfirm>
                </ConfirmModal>
            )}

            {/* 신고하기 팝업 */}
            {isModalType === 'report' &&
                <FormModal
                    type="checkbox"
                    title="유저 신고하기"
                    width="494px"
                    height="721px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="20px"
                    onClose={handleModalClose}
                >
                    <div>
                        <ReportLabel>신고 사유</ReportLabel>
                        <ReportReasonContent>
                            {REPORT_REASON.map((data) => (
                                <Checkbox
                                    key={data.id}
                                    value={data.id}
                                    label={data.text}
                                    fontSize="regular18"
                                    isChecked={checkedReportItems.includes(data.id)}
                                    onArrayChange={handleReportCheckboxChange}
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
                        <ReportButton>
                            <Button
                                onClick={handleReport}
                                buttonType="primary"
                                text="신고하기"
                                disabled={checkedReportItems.length === 0}
                            />
                        </ReportButton>
                    </div>
                </FormModal>
            }

            {/* 매너평가 팝업 */}
            {isModalType === 'manner' && isMannerStatus && (
                <FormModal
                    type="checkbox"
                    title={isMannerStatus.isExist ? "내가 남긴 매너 평가" : "매너 평가하기"}
                    width="418px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="10px"
                    onClose={handleModalClose}
                >
                    <CheckContent>
                        {isModalType === "manner" && MANNER_TYPES.map((data) => (
                            <Checkbox
                                key={data.id}
                                value={data.id}
                                label={data.text}
                                fontSize="semiBold16"
                                isChecked={checkedMannerItems.includes(data.id)}
                                onArrayChange={handleMannerCheckboxChange}
                            />
                        ))}
                    </CheckContent>
                    <ModalSubmitBtn>
                        <Button
                            onClick={() => isMannerStatus.isExist ? handleMannerEdit('manner') : handleMannerPost()}
                            buttonType="primary"
                            text={isMannerStatus.isExist ? "수정하기" : "완료"}
                            disabled={checkedMannerItems.length === 0}
                        />
                    </ModalSubmitBtn>
                </FormModal>
            )}

            {/* 비매너 평가 팝업 */}
            {isModalType === 'badManner' && isBadMannerStatus && (
                <FormModal
                    type="checkbox"
                    title={isBadMannerStatus?.isExist ? "내가 남긴 비매너 평가" : "비매너 평가하기"}
                    width="418px"
                    closeButtonWidth={17}
                    closeButtonHeight={17}
                    borderRadius="10px"
                    onClose={handleModalClose}
                >
                    <CheckContent>
                        {isModalType === "badManner" && BAD_MANNER_TYPES.map((data) => (
                            <Checkbox
                                key={data.id}
                                value={data.id}
                                label={data.text}
                                fontSize="semiBold16"
                                isChecked={checkedBadMannerItems.includes(data.id)}
                                onArrayChange={handleBadMannerCheckboxChange}
                            />
                        ))}
                    </CheckContent>
                    <ModalSubmitBtn>
                        <Button
                            onClick={() => isBadMannerStatus.isExist ? handleMannerEdit('badManner') : handleBadMannerPost()}
                            buttonType="primary"
                            text={isBadMannerStatus.isExist ? "수정하기" : "완료"}
                            disabled={checkedBadMannerItems.length === 0}
                        />
                    </ModalSubmitBtn>
                </FormModal>
            )}
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

const ModalSubmitBtn = styled.div`
  margin-top:52px;
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

const ReportButton = styled.div`
  margin-top:21px;
`;

const Text = styled.div`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular20};
  margin: 28px 0;
`;

const SmallText = styled.div`
  text-align: center;
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.regular14};
  margin-top: 13px;
`;

const MsgConfirm = styled(Text)`
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;
`;

const NoData = styled.p`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular16};
  margin-top:50%;
`;



