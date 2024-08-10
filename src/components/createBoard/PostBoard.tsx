import styled from "styled-components";
import Dropdown from "../common/Dropdown";
import Input from "../common/Input";
import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import CRModal from "../crBoard/CRModal";
import UpdateProfileImage from "./UpdateProfileImage";
import User from "../crBoard/User";
import Toggle from "../common/Toggle";
import PositionBox, { PositionState } from "../crBoard/PositionBox";
import GameStyle from "./GameStyle";
import ConfirmModal from "../common/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModal } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { editPost, postBoard } from "@/api/board";
import { getUserInfo } from "@/api/member";
import { GameStyleList, UserInfo } from "@/interface/profile";
import { clearCurrentPost } from "@/redux/slices/postSlice";
import { PostReq } from "@/interface/board";

interface PostBoardProps {
    onClose: () => void;
    onCompletedPosting: () => void;
}

const DROP_DATA = [
    { id: 1, value: '빠른대전' },
    { id: 2, value: '솔로랭크' },
    { id: 3, value: '자유랭크' },
    { id: 4, value: '칼바람 나락' },
];

const PostBoard = (props: PostBoardProps) => {
    const { onClose, onCompletedPosting } = props;

    const dispatch = useDispatch();

    const isCompletedModal = useSelector((state: RootState) => state.modal.modalType);
    const currentPost = useSelector((state: RootState) => state.post.currentPost);
    const currentPostId = useSelector((state: RootState) => state.post.currentPostId);

    const [isProfileListOpen, setIsProfileListOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | undefined>(
        currentPost?.profileImage || userInfo?.profileImg
    );
    const [selectedDropOption, setSelectedDropOption] = useState<number>(
        currentPost?.gameMode || 1
    );
    const [positionValue, setPositionValue] = useState<PositionState | undefined>({
        main: currentPost?.mainPosition || userInfo?.mainP,
        sub: currentPost?.subPosition || userInfo?.subP,
        want: currentPost?.wantPosition || 1,
    });
    const [isMicOn, setIsMicOn] = useState<boolean>(currentPost?.mike || false);
    const [selectedStyleIds, setSelectedStyleIds] = useState<number[] | GameStyleList[] | undefined>(
        currentPost?.gameStyles || userInfo?.gameStyleResponseDTOList
    );
    const [textareaValue, setTextareaValue] = useState<string>(currentPost?.contents || '');

    useEffect(() => {
        if (!!currentPost) {
            setSelectedDropOption(currentPost.gameMode);

            setPositionValue({
                main: currentPost.mainPosition,
                sub: currentPost.subPosition,
                want: currentPost.wantPosition,
            });

            setIsMicOn(currentPost.mike);
            setSelectedStyleIds(currentPost.gameStyles);
            setTextareaValue(currentPost.contents || '');
            setSelectedImageIndex(currentPost.profileImage);
        }
    }, [currentPost]);

    /* 프로필 이미지 리스트 중 클릭시 */
    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index + 1);
        setTimeout(() => {
            setIsProfileListOpen(false);
        }, 300); // 300ms 후에 창이 닫히도록 설정
    };

    /* 큐타입 선택 */
    const handleDropValue = (id: number) => {
        setSelectedDropOption(id);
        setIsDropdownOpen(false);
    };

    /* 큐타입 드롭박스 외부 영역 클릭 시 드롭박스 닫힘 */
    const handleDropdownClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDropdownClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleDropdownClickOutside);
        };
    }, []);

    /* 포지션 선택 */
    const handlePositionChange = (newPositionValue: PositionState) => {
        setPositionValue(newPositionValue);
    };

    /* 마이크 유무 선택 */
    const toggleMicHandler = () => {
        setIsMicOn(!isMicOn);
    };

    /* 글 수정 */
    const handleEdit = async (params: PostReq) => {
        if (!currentPostId) return;

        try {
            await editPost(currentPostId, params);
            // await onClose();
        } catch (error) {
        }
    };

    /* 글쓰기 */
    const handlePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedImageIndex
            || !selectedStyleIds
            || !positionValue
        ) return;

        const params = {
            boardProfileImage: selectedImageIndex,
            gameMode: selectedDropOption,
            mainPosition: positionValue.main,
            subPosition: positionValue.sub,
            wantPosition: positionValue.want,
            mike: isMicOn,
            gameStyles: selectedStyleIds,
            contents: textareaValue
        };

        if (!!currentPost) {
            handleEdit(params);
            handleModalClose();
        }

        if (!currentPost) {

            // if (selectedStyleIds.length === 0 || textareaValue.trim() == "") {
            //     return;
            // }

            try {
                await postBoard(params);
                await dispatch(setOpenModal('completedPost'));
            } catch (error) {
            }
        }
    };

    /* 모달 닫기 */
    const handleModalClose = () => {
        onClose();
        dispatch(clearCurrentPost());
    }

    /* 유저 정보 api */
    useEffect(() => {
        const getUserData = async () => {
            const data = await getUserInfo();
            setUserInfo(data.result);
        };

        getUserData();
    }, [])

    /* userInfo가 업데이트된 후 selectedImageIndex 상태 업데이트 */
    useEffect(() => {
        if (userInfo) {
            setSelectedImageIndex(currentPost?.profileImage || userInfo.profileImg);
            setSelectedStyleIds(currentPost?.gameStyles || userInfo.gameStyleResponseDTOList);
        }
    }, [userInfo, currentPost]);


    return (
        <CRModal
            type='posting'
            onClose={handleModalClose}
        >
            {isCompletedModal &&
                <ConfirmModal
                    width="540px"
                    primaryButtonText="확인"
                    onPrimaryClick={onCompletedPosting}
                >
                    글 작성이 완료되었습니다.
                </ConfirmModal>
            }
            <Form onSubmit={handlePost}>
                {userInfo && (
                    <UserSection>
                        <UpdateProfileImage
                            selectedImageIndex={selectedImageIndex}
                            setIsProfileListOpen={setIsProfileListOpen}
                            isProfileListOpen={isProfileListOpen}
                            onImageClick={handleImageClick} />
                        <User
                            account={userInfo.gameName}
                            tag={userInfo.tag}
                            tier={userInfo.tier}
                        />
                    </UserSection>
                )}

                <QueueNMicSection>
                    <Div>
                        <Title className="micTitle">마이크</Title>
                        <Toggle
                            isOn={isMicOn}
                            onToggle={toggleMicHandler}
                            type="board" />
                    </Div>
                    <Div>
                        <Title className="queueTitle">큐타입</Title>
                        <Dropdown
                            ref={dropdownRef}
                            type="type2"
                            padding="11px 21px"
                            width="234px"
                            list={DROP_DATA}
                            open={isDropdownOpen}
                            setOpen={setIsDropdownOpen}
                            onDropValue={handleDropValue}
                            defaultValue={selectedDropOption}
                        />
                    </Div>
                </QueueNMicSection>
                <PositionSection>
                    <Title className="positionTitle">포지션</Title>
                    <PositionBox
                        status={!!currentPost ? "editing" : "posting"}
                        onPositionChange={handlePositionChange}
                        main={positionValue.main}
                        sub={positionValue.sub}
                        want={positionValue.want}
                    />
                </PositionSection>
                <StyleSection>
                    <Title className="gameStyleTitle">게임 스타일</Title>
                    {userInfo && (
                        <GameStyle
                            type={!!currentPost ? "editing" : "posting"}
                            setSelectedIds={setSelectedStyleIds}
                            selectedIds={selectedStyleIds}
                            gameStyles={
                                currentPost ?
                                    currentPost.gameStyles
                                    :
                                    userInfo.gameStyleResponseDTOList
                            }
                        />
                    )}
                </StyleSection>
                <MemoSection>
                    <Title className="memoTitle">메모</Title>
                    <Input
                        height="77px"
                        inputType="textarea"
                        value={textareaValue}
                        id="memo"
                        onChange={(value) => {
                            setTextareaValue(value);
                        }} />
                </MemoSection>
                <ButtonContent>
                    <Button
                        type="submit"
                        buttonType="primary"
                        text="확인"
                        disabled={textareaValue.trim() == ""} />
                </ButtonContent>
            </Form>
        </CRModal>
    )
};

export default PostBoard;

const Form = styled.form``;
const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color: #2D2D2D;
    &.micTitle {
        margin-bottom: 11px;
    }
    &.queueTitle {
        margin-bottom: 5px;
    }
    &.positionTitle {
        margin-bottom: 5px;
    }
    &.gameStyleTitle {
        margin-bottom: 5px;
    }
    &.memoTitle{
        margin-bottom: 5px;
    }
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap:17px;
`
const QueueNMicSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap:187px;
    margin-top:24px;    
`;

const Div = styled.div``;

const PositionSection = styled.div`
    margin-top:33px;    
`;

const StyleSection = styled.div`
    margin-top:34px;    
`;

const MemoSection = styled.div`
    margin-top:34px;    
`;
const ButtonContent = styled.p`
    padding:0 0 28px;
    margin-top:74px;    
    text-align: center;
`;