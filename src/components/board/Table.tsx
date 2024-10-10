import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import {
  setAbbrevTier,
  setDateFormatter,
  setPositionImg,
  setProfileImg,
} from "@/utils/custom";
import ReadBoard from "../readBoard/ReadBoard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCloseModal, setOpenReadingModal } from "@/redux/slices/modalSlice";
import { useRouter } from "next/navigation";
import Alert from "../common/Alert";
import ConfirmModal from "../common/ConfirmModal";
import ChatLayout from "../chat/ChatLayout";
import Champion from "../readBoard/Champion";
import { BoardDetail } from "@/interface/board";
import { getProfileBgColor } from "@/utils/profile";
import { toLowerCaseString } from "@/utils/string";

interface TableTitleProps {
  id: number;
  name: string;
}

interface TableProps {
  title: TableTitleProps[];
  content: BoardDetail[];
}

const Table = (props: TableProps) => {
  const { title, content } = props;

  const [isBoardId, setIsBoardId] = useState(0);
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

  const dispatch = useDispatch();
  const router = useRouter();

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
  const handleTextClick = async (gameName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const copied = `#${gameName.replace(/\s+/g, "")}`;
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
  const handleUserProfilePage = (e: React.MouseEvent, memberId: number) => {
    e.stopPropagation();

    if (!isUser.gameName) {
      setAlertContent("탈퇴한 사용자 입니다.");
      return setShowAlert(true);
    }

    router.push(`/user/${memberId}`);
  };

  /* 모달 닫기 */
  const handleModalClose = () => {
    dispatch(setCloseModal());
  };

  return (
    <>
      {showAlert && (
        <Alert
          icon={
            alertContent === "탈퇴한 사용자 입니다." ? "exclamation" : "trash"
          }
          width={45}
          height={50}
          content={alertContent}
          alt={alertContent}
          onClose={() => setShowAlert(false)}
        />
      )}

      {isReadingModal && <ReadBoard postId={isBoardId} />}

      {isChatRoomOpen && <ChatLayout apiType={2} />}

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
                  onClick={() => handlePostOpen(data.boardId)}
                >
                  <First
                    className="table_width"
                    onClick={(e) => handleUserProfilePage(e, data.memberId)}
                  >
                    <ProfileImgWrapper
                      $bgColor={getProfileBgColor(data.profileImage)}
                    >
                      <ProfileImg
                        src={setProfileImg(data.profileImage)}
                        width={35}
                        height={35}
                        alt="프로필 이미지"
                      />
                    </ProfileImgWrapper>

                    <P onClick={(e) => handleTextClick(data.gameName, e)}>
                      {data.gameName}
                    </P>
                  </First>
                  <Second className="table_width">
                    {data.mannerLevel && <P>LV.{data.mannerLevel}</P>}
                  </Second>
                  <Third className="table_width">
                    <Image
                      src={
                        !data.tier
                          ? "/assets/images/tier/unranked.svg"
                          : `/assets/images/tier/${toLowerCaseString(
                              data.tier
                            )}.svg`
                      }
                      width={28}
                      height={26}
                      alt="티어 이미지"
                    />
                    <P>
                      {setAbbrevTier(data.tier)}
                      {data.tier !== "UNRANKED" && data.rank}
                    </P>
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
                    <Champion
                      size={14}
                      list={data.championResponseDTOList.map(
                        (champion) => champion.championId
                      )}
                    />
                  </Sixth>
                  <Seventh className="table_width">
                    <P className={data.winRate >= 50 ? "emph" : "basic"}>
                      {data.winRate === null ? "0%" : `${data.winRate}%`}
                    </P>
                  </Seventh>
                  <Eighth className="table_width">
                    <P>{setDateFormatter(data.createdAt)}</P>
                  </Eighth>
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
  ${(props) => props.theme.fonts.bold16};
  background: ${theme.colors.gray600};
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
  gap: 22px;
`;
const Second = styled.div`
  p {
    color: ${theme.colors.purple100};
    ${(props) => props.theme.fonts.bold16};
  }
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 50px;
  height: 50px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const ProfileImg = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Third = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
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
const Eighth = styled.div``;
const P = styled.p`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.black};
  white-space: nowrap;
  &.emph {
    color: ${theme.colors.purple100};
    ${(props) => props.theme.fonts.bold16};
  }
  &.basic {
    color: ${theme.colors.black};
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

const Copied = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 28px;
  ${(props) => props.theme.fonts.regular14};
  background: ${theme.colors.white};
  color: rgba(45, 45, 45, 1);
  box-shadow: 0px 0px 25.3px 0px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  white-space: nowrap;
`;
