import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { setAbbrevTier, setDateFormatter, setPositionImg, setProfileImg } from "@/utils/custom";
import ReadBoard from "../readBoard/ReadBoard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCloseModal, setCloseReadingModal, setOpenModal, setOpenReadingModal } from "@/redux/slices/modalSlice";
import { useRouter } from "next/navigation";
import Alert from "../common/Alert";
import ConfirmModal from "../common/ConfirmModal";
import { BoardList } from "@/interface/board";
import ChatRoom from "../chat/ChatRoom";
import { editManners, postBadMannerValue, postMannerValue } from "@/api/manner";

interface TableTitleProps {
    id: number;
    name: string;
};

interface TableProps {
    title: TableTitleProps[];
    content: BoardList[];
};

const Table = (props: TableProps) => {
    const { title, content } = props;

    const [isBoardId, setIsBoardId] = useState(0);
    const [showAlert, setShowAlert] = useState(false);

    const isReadingModal = useSelector((state: RootState) => state.modal.readingModal);
    const isModalType = useSelector((state: RootState) => state.modal.modalType);
    const isUser = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch();
    const router = useRouter();

    /* 게시글 열기 */
    const handlePostOpen = (id: number) => {
        // const exists = content.some(board => board.boardId === id);
        // console.log(exists)
        // if (!exists) {
        //     return setShowAlert(true);
        // }

        dispatch(setOpenReadingModal());
        setIsBoardId(id);
    };

    useEffect(() => {
        if (isReadingModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isReadingModal]);

    /* 소환사명 복사 */
    const handleTextClick = async (gameName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const copied = `#${gameName.replace(/\s+/g, '')}`;
        try {
            await navigator.clipboard.writeText(copied);
            await dispatch(setOpenModal("copied"));
        } catch (error) {
            console.error('복사 실패', error);
        }
    };

    /* 다른 사람 프로필 이동 */
    const handleUserProfilePage = (e: React.MouseEvent, memberId: number) => {
        if (!isUser.id) return;

        e.stopPropagation();
        router.push(`/user/${memberId}`);
    }

    /* 모달 닫기 */
    const handleModalClose = () => {
        dispatch(setCloseModal());
    };
  const isChatRoomOpen = useSelector((state: RootState) => state.chat.isChatRoomOpen);
  const [isMemberId, setIsMemberId] = useState<number>();
  const [targetMemberId, setTargetMemberId] = useState<number | null>(null);
  const [checkedMannerItems, setCheckedMannerItems] = useState<number[]>([]);
  const [checkedBadMannerItems, setCheckedBadMannerItems] = useState<number[]>([]);

  const handleMemberIdGet = (id: number) => {
    setIsMemberId(id);
    setTargetMemberId(id);
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
      console.error(error);
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
      console.error(error);
    }
  };

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
      console.error(error);
    }
  };
    return (
        <>
            {showAlert && <Alert
                icon="trash"
                width={45}
                height={50}
                content="해당 글은 삭제된 글입니다."
                alt="삭제된 글"
                onClose={() => setShowAlert(false)}
            />}
            {isReadingModal &&
                <ReadBoard postId={isBoardId} />
            }
               {isChatRoomOpen && <ChatRoom 
                         api="board"
                         chatId={isBoardId}
                         onMemberId={handleMemberIdGet}
                         onMannerEdit={handleMannerEdit}
                         onMannerCheckboxChange={handleMannerCheckboxChange}
                         onBadMannerCheckboxChange={handleBadMannerCheckboxChange}
                         onMannerPost={handleMannerPost}
                         onBadMannerPost={handleBadMannerPost}
               />}
            <TableWrapper>
                <TableHead>
                    {title.map(data => {
                        return (
                            <Title key={data.id} className="table_width">{data.name}</Title>
                        )
                    })}
                </TableHead>
                {content?.length > 0 ? (
                    <TableContent>
                        {content?.map(data => {
                            return (
                                <Row key={data.boardId}
                                    onClick={() => handlePostOpen(data.boardId)}>
                                    <First className="table_width" onClick={(e) => handleUserProfilePage(e, data.memberId)}>
                                        <Image
                                            src={setProfileImg(data.profileImage)}
                                            width={50}
                                            height={50}
                                            alt="프로필 이미지"
                                        />
                                        <P onClick={(e) => handleTextClick(data.gameName, e)}>{data.gameName}</P>
                                    </First>
                                    <Second className="table_width">
                                        {data.mannerLevel &&
                                            <P>LV.{data.mannerLevel}</P>
                                        }
                                    </Second>
                                    <Third className="table_width">
                                        <Image
                                            src={
                                                !data.tier ? "/assets/images/tier/UNRANK.svg" : `/assets/images/tier/${data.tier}.svg`}
                                            width={26}
                                            height={13}
                                            alt="티어 이미지"
                                        />
                                        <P>{!data.tier ? "UR" : setAbbrevTier(data.tier)}{data.rank}</P>
                                    </Third>
                                    <Fourth className="table_width">
                                        <Image
                                            src={setPositionImg(data.mainPosition)}
                                            width={35}
                                            height={28}
                                            alt="메인 포지션"
                                        />
                                        <Image
                                            src={setPositionImg(data.subPosition)}
                                            width={35}
                                            height={28}
                                            alt="서브 포지션"
                                        />
                                    </Fourth>
                                    <Fifth className="table_width">
                                        <Image
                                            src={setPositionImg(data.wantPosition)}
                                            width={35}
                                            height={28}
                                            alt="찾는 포지션"
                                        />
                                    </Fifth>
                                    <Sixth className="table_width">
                                        {data.championList.map((data, index) => (
                                            // <Image
                                            //     key={index}
                                            //     src={data}
                                            //     width={50}
                                            //     height={50}
                                            //     alt="챔피언 이미지"
                                            // />
                                            data
                                        ))}
                                    </Sixth>
                                    <Seventh className="table_width">
                                        {data.winRate &&
                                            <P className={data.winRate >= 50 ? 'emph' : 'basic'}>{data.winRate}%</P>
                                        }
                                    </Seventh>
                                    <Eighth className="table_width">
                                        <P>{setDateFormatter(data.createdAt)}</P>
                                    </Eighth>
                                </Row>
                            )
                        })}
                    </TableContent>
                ) : (
                    <NoData>게시된 글이 없습니다.</NoData>
                )}
            </TableWrapper>

            {/* 소환사명 복사 모달 */}
            {isModalType === 'copied' &&
                <ConfirmModal
                    width="540px"
                    primaryButtonText="확인"
                    secondaryButtonText="나가기"
                    onPrimaryClick={handleModalClose}
                >
                    <Text>
                        {`소환사명이 클립보드에 복사되었습니다.`}
                    </Text>
                </ConfirmModal>
            }
        </>
    )
};

export default Table;

const TableWrapper = styled.div`
    width: 100%;
    text-align: center;
    .table_width {
    &:first-child{
            width: 17%;
    }
    &:nth-child(2){
            width: 13%;
    }
    &:nth-child(3){
            width: 10%;
    }
    &:nth-child(4){
            width: 12%;
    }
    &:nth-child(5){
            width: 13%;
    }
    &:nth-child(6){
            width: 20%;
    }
    &:nth-child(7){
            width: 9%;
    }
    &:last-child{
            width: 11%;
    }
        }
`;

const TableHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:14px 21px;
    ${(props) => props.theme.fonts.bold16};
    background: ${theme.colors.gray600};
    color:${theme.colors.white};
    border-radius:8px;
`;

const Title = styled.p`
    &:first-child{
      text-align: left;
    }  
`;

const TableContent = styled.div``;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:22px 21px;
    border-bottom: 1px solid #D4D4D4;
    cursor: pointer;    
`;

const First = styled.div`
    display: flex;
    align-items: center;
    gap:22px;
`;
const Second = styled.div`
    p {
        color:${theme.colors.purple100};
        ${(props) => props.theme.fonts.bold16};
    }
`;

const Third = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:2px;
`;

const Fourth = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:21px;
`;
const Fifth = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Sixth = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:5px;
`;
const Seventh = styled.div``;
const Eighth = styled.div``;
const P = styled.p`
    ${(props) => props.theme.fonts.medium16};
    color:${theme.colors.black};
    &.emph{
        color:${theme.colors.purple100};
        ${(props) => props.theme.fonts.bold16};
    }
    &.basic{
    color:${theme.colors.black};
    ${(props) => props.theme.fonts.medium16};
    }
`;

const NoData = styled.p`
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.medium16};
  text-align: center;
  margin-top: 47px;
`;

const Text = styled.div`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular18};
  margin: 28px 0;
`;