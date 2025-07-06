import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import {
  blockMember,
  cancelFriendRequest,
  deleteFriend,
  deletePost,
  getMemberPost,
  pullUpPost,
  sendFriendRequest,
  unblockMember,
} from "@/api";
import {
  Alert,
  Champion,
  ConfirmModal,
  Layout,
  MoreBox,
  MoreBoxButton,
  ReadBoard,
  ReportModal,
} from "@/components";
import { notify } from "@/hooks/notify";
import { setRefresh } from "@/redux/slices/boardSlice";
import {
  setCloseModal,
  setCloseReadingModal,
  setOpenModal,
  setOpenPostingModal,
  setOpenReadingModal,
} from "@/redux/slices/modalSlice";
import { setCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { theme } from "@/styles/theme";
import {
  setAbbrevTier,
  setCustomProfileImg,
  setPositionImg,
} from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";
import { toLowerCaseString } from "@/utils/string";
import { setDateFormatter } from "@/utils/timeFormat";

import type { RootState } from "@/redux/store";
import type {
  AlertProps,
  BoardListDetail,
  MemberPost,
  MoreBoxMenuItems,
} from "@/types";

interface TableTitleProps {
  id: number;
  name: string;
}

interface TableProps {
  title: TableTitleProps[];
  content: BoardListDetail[];
}

const Table = (props: TableProps) => {
  const { title, content } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const [isBoardId, setIsBoardId] = useState(0);
  const [isPost, setIsPost] = useState<MemberPost>();
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const isChatRoomOpen = useSelector(
    (state: RootState) => state.chat.isChatRoomOpen
  );
  const [copiedAlert, setCopiedAlert] = useState(false);

  const isReadingModal = useSelector(
    (state: RootState) => state.modal.readingModal
  );
  const isModalType = useSelector((state: RootState) => state.modal.modalType);
  const isUser = useSelector((state: RootState) => state.user);

  const [isBlockedStatus, setIsBlockedStatus] = useState(false);
  const [isFriendStatus, setIsFriendStatus] = useState(false);
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfrimOpen] = useState(false);
  const [isPullUpConfirmOpen, setIsPullUpConfirmOpen] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertProps>({
    icon: "",
    width: 0,
    height: 0,
    content: "",
    alt: "",
    onClose: () => {},
    buttonText: "",
  });

  /* 로그아웃 시, 비회원 접근 시 알럿 props 설정 함수 */
  const logoutMessage = "로그아웃 되었습니다. 다시 로그인 해주세요.";
  const loginRequiredMessage = "로그인이 필요한 서비스입니다.";
  const deletedMessage = "해당 글은 삭제된 글입니다.";

  /* 게시글 열기 */
  const handlePostOpen = (boardId: number) => {
    const exists = content.some((board) => board.boardId === boardId);

    if (!exists) {
      setAlertContent("해당 글은 삭제된 글입니다.");
      return setShowAlert(true);
    }

    dispatch(setOpenReadingModal());
    setIsBoardId(boardId);
  };

  const showAlertWithContent = (
    icon: string,
    content: string,
    handleAlertClose: () => void,
    btnText: string
  ) => {
    setAlertProps({
      icon: icon,
      width: 68,
      height: 58,
      content: content,
      alt: "경고",
      onClose: handleAlertClose,
      buttonText: btnText,
    });
    setShowAlert(true);
  };

  useEffect(() => {
    if (isReadingModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isReadingModal]);

  /* 소환사명 복사 */
  const handleTextClick = async (
    gameName: string,
    tag: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const copied = `${gameName.replace(/\s+/g, "")}#${tag}`;
    try {
      await navigator.clipboard.writeText(copied);
      await setCopiedAlert(true);
    } catch (error) {
      console.error("복사 실패", error);
    }
  };

  /* 소환사명 복사 멘트 3초후 사라짐 */
  useEffect(() => {
    let timer: any;
    if (copiedAlert) {
      timer = setTimeout(() => {
        setCopiedAlert(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [copiedAlert]);

  /* 다른 사람 프로필 이동 */
  const handleMoveProfilePage = (e: React.MouseEvent, memberId: number) => {
    e.stopPropagation();

    router.push(`/user/${memberId}`);
  };

  /* 모달 닫기 */
  const handleModalClose = () => {
    dispatch(setCloseModal());
  };

  /* 차단하기 및 차단 해제 */
  const handleBlock = async () => {
    setIsBlockBoxOpen(!isBlockBoxOpen);
    setIsMoreBoxOpen(false);
  };

  const handleRunBlock = async () => {
    // 차단하기 api
    setIsBlockBoxOpen(false);
    if (isPost) {
      if (isPost.isBlocked) {
        await unblockMember(isPost.memberId);
        setIsBlockedStatus(false);
      } else {
        await blockMember(isPost.memberId);
        setIsBlockedStatus(true);
      }
    }
    setIsBlockConfrimOpen(true);
  };

  /* 친구 추가 */
  const handleFriendAdd = async () => {
    try {
      if (isPost) {
        await sendFriendRequest(isPost.memberId);
      }
      await handleMoreBoxClose();
      setIsFriendStatus(true);
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  };

  /* 친구 요청 취소 */
  const handleCancelFriendReq = async () => {
    try {
      if (isPost) {
        await cancelFriendRequest(isPost.memberId);
      }
      await handleMoreBoxClose();
      setIsFriendStatus(false);
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  };

  /* 친구 삭제 */
  const handleFriendDelete = async () => {
    try {
      if (isPost) {
        await deleteFriend(isPost.memberId);
      }
      await handleMoreBoxClose();
      setIsFriendStatus(false);
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  };

  /* 게시글 끌어올리기 */
  const handlePullUp = () => {
    setIsMoreBoxOpen((prevState) => !prevState);
    if (isBoardId) {
      setIsPullUpConfirmOpen(true);
      dispatch(setCloseReadingModal());
    }
  };

  const handlePullUpAction = async () => {
    // 게시판 끌어올리기 API
    dispatch(setCloseReadingModal());
    await setIsPullUpConfirmOpen(false);
    await pullUpPost(isBoardId);
    await dispatch(setRefresh());

    await notify({
      text: "끌어올리기가 완료되었습니다",
      icon: "👌🏼",
      type: "success",
    });
  };

  /* 게시글 수정 */
  const handleEdit = async () => {
    setIsMoreBoxOpen((prevState) => !prevState);
    if (isBoardId) {
      await dispatch(setOpenPostingModal());
      await dispatch(setCloseReadingModal());
      dispatch(setPostStatus(""));
    }
  };

  /* 게시글 삭제 */
  const handleDelete = async () => {
    setIsMoreBoxOpen((prevState) => !prevState);
    try {
      await deletePost(isBoardId);
      await dispatch(setPostStatus("delete"));
      await dispatch(setCloseReadingModal());
      await dispatch(setPostStatus(""));
    } catch (error) {
      console.error(error);
    }
  };
  /* 신고하기 모달 오픈 */
  const handleReportModal = () => {
    // 신고하기 버튼 클릭 시점 토큰 만료
    if (!isUser.gameName) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }

    dispatch(setOpenModal("report"));
    handleMoreBoxClose();
  };

  /* 더보기 버튼 토글 */
  const handleMoreBoxToggle = async (boardId: number) => {
    setIsBoardId(boardId);
    const response = await getMemberPost(boardId);
    setIsPost(response.data);
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  /* 더보기 버튼 닫기 */
  const handleMoreBoxClose = () => {
    setIsMoreBoxOpen(false);
  };

  /* 더보기 버튼 메뉴 */
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [];

  if (isUser?.id === isPost?.memberId) {
    /* 내가 작성한 글 */
    MoreBoxMenuItems.push(
      { text: "끌어올리기", onClick: handlePullUp },
      { text: "수정", onClick: handleEdit },
      { text: "삭제", onClick: handleDelete }
    );
  } else {
    /* 다른 사람이 작성한 글 */
    //친구 삭제 - 차단되어있을 때, 친구일 때, 친구 추가 요청 중일 때
    //친구 추가(친구 요청) - 친구가 아닐 때, 차단되어있지 않을 때, 친구 추가 요청 중이 아닐 때
    //친구 요청 취소 - 친구 추가 요청 중일 떄
    //차단하기 - 친구 추가 요청 중일 때, 친구 삭제된 상태일 때, 차단되어있지 않을 때
    //차단해제 - 차단되어 있을 때,

    let friendText = "";
    let friendFunc = null;

    if (!isBlockedStatus) {
      if (isPost?.isFriend) {
        friendText = "친구 삭제";
        friendFunc = handleFriendDelete;
      } else {
        if (!isPost?.isFriend && isPost?.friendRequestMemberId !== isUser.id) {
          friendText = "친구 추가";
          friendFunc = handleFriendAdd;
        }
        if (!isPost?.isFriend && isPost?.friendRequestMemberId === isUser.id) {
          friendText = "친구 요청 취소";
          friendFunc = handleCancelFriendReq;
        }
      }
    }

    if (friendText && friendFunc) {
      MoreBoxMenuItems.push({ text: friendText, onClick: friendFunc });
    }

    MoreBoxMenuItems.push(
      {
        text: isPost?.isBlocked ? "차단 해제" : "차단하기",
        onClick: handleBlock,
      },
      { text: "신고하기", onClick: handleReportModal }
    );
  }

  return (
    <>
      {showAlert && (
        <Alert
          icon={
            alertContent === "로그인이 필요한 서비스입니다."
              ? "exclamation"
              : "trash"
          }
          width={45}
          height={50}
          content={alertContent}
          alt={alertContent}
          onClose={() => setShowAlert(false)}
          buttonText="확인"
        />
      )}

      {isReadingModal && !isChatRoomOpen && <ReadBoard postId={isBoardId} />}

      {isChatRoomOpen && <Layout />}

      {copiedAlert && <Copied>소환사명이 클립보드에 복사되었습니다.</Copied>}
      <TableWrapper>
        <TableHead>
          {title.map((data) => {
            return (
              <Title key={data.id} className="table_width">
                {data.name}
              </Title>
            );
          })}
        </TableHead>
        {content?.length > 0 ? (
          <TableContent>
            {content?.map((data) => {
              return (
                <Row
                  key={data.boardId}
                  onClick={() => {
                    setIsMoreBoxOpen(false);
                    handlePostOpen(data.boardId);
                  }}
                >
                  <First className="table_width">
                    <ProfileImgWrapper
                      $bgColor={getProfileBgColor(data.profileImage)}
                      onClick={(e) => handleMoveProfilePage(e, data.memberId)}
                    >
                      <ProfileImg
                        data={setCustomProfileImg(data.profileImage)}
                        width={35}
                        height={35}
                      />
                    </ProfileImgWrapper>
                    <NameRow>
                      <P>{data.gameName}</P>
                      <CopyButton
                        onClick={(e) =>
                          handleTextClick(data.gameName, data.tag, e)
                        }
                      >
                        복사
                      </CopyButton>
                    </NameRow>
                  </First>
                  <Second className="table_width">
                    {data.mannerLevel && <p>LV.{data.mannerLevel}</p>}
                  </Second>
                  <Third className="table_width">
                    <TierImage
                      data={
                        !data.tier
                          ? "/assets/images/tier/unranked.svg"
                          : `/assets/images/tier/${toLowerCaseString(
                              data.tier
                            )}.svg`
                      }
                      width={28}
                      height={26}
                    />
                    <P>
                      {setAbbrevTier(data.tier || "")}
                      {data.tier !== "UNRANKED" && data.rank}
                    </P>
                  </Third>
                  <Fourth className="table_width">
                    <Image
                      src={setPositionImg(data.mainP)}
                      width={36}
                      height={36}
                      alt="메인 포지션"
                    />
                    <Image
                      src={setPositionImg(data.subP)}
                      width={36}
                      height={36}
                      alt="서브 포지션"
                    />
                  </Fourth>
                  <Fifth className="table_width">
                    {data.wantP?.length > 0 ? (
                      data.wantP.map((posi, i) => (
                        <Image
                          key={`${posi}-${i}`}
                          src={setPositionImg(posi || "ANY")}
                          width={36}
                          height={36}
                          alt="찾는 포지션"
                        />
                      ))
                    ) : (
                      <Image
                        src={setPositionImg("ANY")}
                        width={35}
                        height={28}
                        alt="찾는 포지션"
                      />
                    )}
                  </Fifth>
                  <Sixth className="table_width">
                    <Champion
                      font="semiBold14"
                      list={data?.championStatsResponseList || []}
                    />
                  </Sixth>
                  <Seventh className="table_width">
                    <P className={data.winRate >= 50 ? "emph" : "basic"}>
                      {data.winRate === null ? "0%" : `${data.winRate}%`}
                    </P>
                  </Seventh>
                  <Eighth className="table_width">
                    <Content>{data.contents}</Content>
                  </Eighth>
                  <Ninth className="table_width">
                    <P className="gray">
                      {setDateFormatter(data.bumpTime || data.createdAt)}
                    </P>
                    {isUser.id ? (
                      <More>
                        <MoreBoxButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoreBoxToggle(data.boardId);
                          }}
                        />
                        {isMoreBoxOpen && isBoardId === data.boardId && (
                          <MoreBox
                            items={MoreBoxMenuItems}
                            top={0}
                            left={-180}
                            onClose={(e: any) => {
                              setIsMoreBoxOpen(false);
                            }}
                          />
                        )}
                      </More>
                    ) : null}
                  </Ninth>
                </Row>
              );
            })}
          </TableContent>
        ) : (
          <NoData>게시된 글이 없습니다.</NoData>
        )}
      </TableWrapper>
      {/* 소환사명 복사 모달 */}
      {isModalType === "copied" && (
        <ConfirmModal
          width="540px"
          primaryButtonText="확인"
          secondaryButtonText="나가기"
          onPrimaryClick={handleModalClose}
        >
          <Text>{`소환사명이 클립보드에 복사되었습니다.`}</Text>
        </ConfirmModal>
      )}
      {/* 차단하기 팝업 */}
      {isBlockBoxOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="예"
          secondaryButtonText="아니요"
          onPrimaryClick={() => {
            handleRunBlock();
          }}
          onSecondaryClick={() => {
            setIsBlockBoxOpen(false);
          }}
        >
          {isBlockedStatus ? (
            <MsgConfirm>{"차단을 해제 하시겠습니까?"}</MsgConfirm>
          ) : (
            <Msg>
              {
                "차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다.\n\n차단하시겠습니까?"
              }
            </Msg>
          )}
        </ConfirmModal>
      )}
      {/* 차단하기 확인 팝업 */}
      {isBlockConfirmOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="확인"
          onPrimaryClick={() => {
            setIsBlockConfrimOpen(false);
          }}
        >
          <MsgConfirm>{`${
            isBlockedStatus ? "차단이" : "차단 해제가"
          } 완료되었습니다.`}</MsgConfirm>
        </ConfirmModal>
      )}
      {/* 끌어올리기 확인 팝업 */}
      {isPullUpConfirmOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="아니요"
          secondaryButtonText="예"
          onPrimaryClick={() => {
            setIsPullUpConfirmOpen(false);
          }}
          onSecondaryClick={handlePullUpAction}
        >
          <MsgConfirm>{`본 게시글을 끌어올리시겠습니까?`}</MsgConfirm>
        </ConfirmModal>
      )}
      {/* 신고하기 팝업 */}
      {isModalType === "report" && (
        <ReportModal isPost={isPost} postId={isBoardId} />
      )}
    </>
  );
};

export default Table;

const TableWrapper = styled.div`
  width: 100%;
  text-align: center;
  .table_width {
    &:first-child {
      width: 17%;
    }
    &:nth-child(2) {
      width: 13%;
    }
    &:nth-child(3) {
      width: 10%;
    }
    &:nth-child(4) {
      width: 12%;
    }
    &:nth-child(5) {
      width: 13%;
    }
    &:nth-child(6) {
      width: 20%;
    }
    &:nth-child(7) {
      width: 9%;
    }
    &:nth-child(8) {
      width: 15%;
    }
    &:last-child {
      width: 11%;
    }
  }
`;

const TableHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 21px;
  ${(props) => props.theme.fonts.bold14};
  background: ${theme.colors.gray700};
  color: ${theme.colors.white};
  border-radius: 8px;
`;

const Title = styled.p`
  &:first-child {
    text-align: left;
  }
`;

const TableContent = styled.div``;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 21px;
  border-bottom: 1px solid #d4d4d4;
  cursor: pointer;
`;

const First = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Second = styled.div`
  p {
    color: ${theme.colors.violet600};
    ${(props) => props.theme.fonts.bold16};
  }
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 50px;
  height: 50px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
  aspect-ratio: 1;
`;

const ProfileImg = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const Third = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
`;

const TierImage = styled.object`
  pointer-events: none;
`;

const Fourth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 21px;
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
  gap: 5px;
`;

const Seventh = styled.div``;

const Eighth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Ninth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    width: 60px;
  }
`;

const More = styled.div`
  position: relative;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  &:hover > button {
    display: inline-flex;
  }
`;

const P = styled.p`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.gray800};
  white-space: nowrap;
  &.emph {
    color: ${theme.colors.violet600};
    ${(props) => props.theme.fonts.bold16};
  }
  &.gray {
    color: ${theme.colors.gray500};
    ${(props) => props.theme.fonts.medium16};
  }
`;

const Content = styled.div`
  display: -webkit-box;
  width: 156px;
  max-height: 52px;
  padding: 8px;
  text-align: center;
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray400};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular13};
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CopyButton = styled.button`
  width: auto;
  height: 20px;
  margin-left: 10px;
  border-radius: 2px;
  padding: 0px 7px;
  background: ${theme.colors.gray600};
  color: ${theme.colors.white};
  ${theme.fonts.medium11};
  line-height: 11px;
  white-space: nowrap;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  display: none;
  &:hover {
    color: ${theme.colors.violet300};
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

const Copied = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 28px;
  ${(props) => props.theme.fonts.regular14};
  background: ${theme.colors.white};
  color: rgba(45, 45, 45, 1);
  box-shadow: 0 0 25.3px 0 rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  white-space: nowrap;
`;

const Msg = styled.div`
  text-align: center;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular25};
  margin: 28px 0;
`;

const MsgConfirm = styled(Msg)`
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;
`;
