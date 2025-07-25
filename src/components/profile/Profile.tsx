import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import styled, { css } from "styled-components";

import {
  Button,
  Champion,
  Checkbox,
  ConfirmModal,
  FormModal,
  Input,
  Mic,
  MoreBox,
  MoreBoxButton,
  RankTier,
  Toggle,
  UpdateProfileImage,
} from "@/components";
import { REPORT_REASON } from "@/constants";
import { useConfirmModalContext, useMediaQueryContext } from "@/hooks";
import { setMatchInfo } from "@/redux/slices/matchInfo";
import { setOpenAlertModal } from "@/redux/slices/modalSlice";
import { theme } from "@/styles/theme";

import GameStyle from "../match/GameStyle";
import { useBlock } from "./Profile/hooks/useBlock";
import { useFriend } from "./Profile/hooks/useFriend";
import { useMike } from "./Profile/hooks/useMike";
import { useMoreBoxOutsideClick } from "./Profile/hooks/useMoreBoxOutsideClick";
import { usePosition } from "./Profile/hooks/usePosition";
import { useProfileImage } from "./Profile/hooks/useProfileImage";
import { useReport } from "./Profile/hooks/useReport";
import ProfilePositionSection from "./Profile/ProfilePositionSection";

import type { Mike as MikeType } from "@generated";
import type { RootState } from "@/redux/store";
import type { MoreBoxMenuItems, Position as PositionType, User } from "@/types";

type profileType = "normal" | "wind" | "other" | "me";

interface Profile {
  user: User;
  profileType: profileType;
  updateFriendState?: (state: {
    friend: boolean;
    friendRequestMemberId: number | null;
    blocked: boolean;
  }) => void;
  backgroundColor?: string;
  isDefault?: boolean; // 비회원용 default 프로필 여부
}

const Profile: React.FC<Profile> = ({
  profileType,
  user,
  updateFriendState,
  backgroundColor,
  isDefault = false,
}) => {
  const { isMobile, isTablet } = useMediaQueryContext();
  const { openConfirmModal, closeConfirmModal } = useConfirmModalContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const memberId = Number(id);
  const myId = useSelector((state: RootState) => state.user.id);

  /// hooks
  /* 마이크 상태 */
  const { isMike, handleMike, setIsMike } = useMike(user);

  /* 프로필 이미지 */
  const {
    selectedImageIndex,
    setSelectedImageIndex,
    isProfileListOpen,
    setIsProfileListOpen,
    handleImageClick,
  } = useProfileImage(user);

  /* 포지션 */
  const { positionValue, setPositionValue, handlePositionChange } = usePosition(
    user,
    profileType
  );

  /* 신고 상태 */
  const {
    isReportBoxOpen,
    setIsReportBoxOpen,
    handleCheckboxChange,
    checkedItems,
    setCheckedItems,
    reportDetail,
    setReportDetail,
    handleRunReport,
  } = useReport(memberId, myId || 0);

  const { handleFriendState } = useFriend(
    user,
    myId || 0,
    memberId,
    updateFriendState
  );

  /* 차단 상태 */
  const {
    isBlockBoxOpen,
    setIsBlockBoxOpen,
    isBlockConfirmOpen,
    setIsBlockConfirmOpen,
    handleRunBlock,
  } = useBlock(user, memberId, updateFriendState);

  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const moreBoxRef = useMoreBoxOutsideClick(isMoreBoxOpen, () =>
    setIsMoreBoxOpen(false)
  );

  ///

  /* 포지션 */
  const [isPositionOpen, setIsPositionOpen] = useState({
    main: false,
    sub: false,
    want: [false, false], // 최대 2개의 want 포지션
  });

  // 상위 컴포넌트에서 user 변경 시 업데이트
  useEffect(() => {
    setIsMike(user.mike as MikeType);
    setPositionValue({
      main: user.mainP,
      sub: user.subP,
      want: user.wantP, // 나중에 wantP값 받아서 수정
    });
    setSelectedImageIndex(user.profileImg);
  }, [user]);

  useEffect(
    () => {
      const gameStyleIds = user.gameStyleResponseList.map(
        (style) => style.gameStyleId
      );

      dispatch(
        setMatchInfo({
          mike: isMike,
          mainP: positionValue.main ?? "ANY",
          subP: positionValue.sub ?? "ANY",
          wantP: positionValue.want ?? [],
          gameStyleResponseDTOList: gameStyleIds,
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMike, positionValue, dispatch]
  );

  useEffect(() => {
    setIsMike(isMike);
  }, [isMike]);

  useEffect(() => {
    if (isBlockConfirmOpen) {
      openConfirmModal({
        width: "540px",
        primaryButtonText: "확인",
        onPrimaryClick: () => {
          setIsBlockConfirmOpen(false);
        },
        children: (
          <MsgConfirm>{`${
            user.blocked ? "차단이" : "차단 해제가"
          } 완료되었습니다.`}</MsgConfirm>
        ),
      });
    }
  }, [isBlockConfirmOpen]);

  const handleReport = () => {
    setIsReportBoxOpen(!isReportBoxOpen);
    setIsMoreBoxOpen(false);
  };

  const handleBlock = async () => {
    /* 차단하기 팝업 */
    openConfirmModal({
      width: "540px",
      primaryButtonText: "예",
      secondaryButtonText: "아니요",
      onPrimaryClick: () => handleRunBlock(),
      children: user.blocked ? (
        <MsgConfirm>{"차단을 해제 하시겠습니까?"}</MsgConfirm>
      ) : (
        <Msg>
          {
            "차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다.\n\n차단하시겠습니까?"
          }
        </Msg>
      ),
    });

    setIsMoreBoxOpen(false);
  };

  /* 포지션 선택창 관련 함수*/
  // 포지션 선택창 열기 (포지션 클릭시 동작)
  const handlePosition = (type: "main" | "sub" | "want", index: number = 0) => {
    if (profileType === "other") return;

    setIsPositionOpen((prev) => {
      if (type === "want") {
        const updatedWant = prev.want.map((open, i) =>
          i === index ? !open : false
        );
        return {
          ...prev,
          want: updatedWant,
          main: false,
          sub: false,
        };
      } else {
        return {
          ...prev,
          [type]: !prev[type],
          want: [false, false],
          ...(type === "main" ? { sub: false } : { main: false }),
        };
      }
    });
  };

  // 포지션 선택창 닫기
  const handlePositionClose = (
    type: "main" | "sub" | "want",
    index: number = 0
  ) => {
    if (profileType === "other") return;

    setIsPositionOpen((prev) => {
      if (type === "want") {
        const updatedWant = [...prev.want];
        updatedWant[index] = false;
        return { ...prev, want: updatedWant };
      } else {
        return { ...prev, [type]: false };
      }
    });
  };

  const handleCategoryButtonClick = (
    selectedValue: PositionType | null,
    type: "main" | "sub" | "want",
    index: number = 0
  ) => {
    let newPositionValue = { ...positionValue };

    if (type === "want") {
      const wantArray = [...(newPositionValue.want ?? [])];
      wantArray[index] = selectedValue;
      newPositionValue.want = wantArray;
    } else {
      if (selectedValue === null) return;
      newPositionValue[type] = selectedValue;
    }

    setPositionValue(newPositionValue);
    handlePositionChange(newPositionValue);
  };

  const renderFriendsButton = () => {
    if (isDefault || user.blocked) return null;
    if (memberId === myId || user.id === myId) return null;

    const width = isMobile ? "100%" : "218px";

    // 친구 요청 수락/거절 버튼만 예외적으로 두 개라서 따로 처리
    if (user.friendRequestMemberId === memberId) {
      return (
        <Admit>
          <FriendRow>
            <Button
              buttonType="secondary"
              width={width}
              text="친구 거절"
              onClick={() => handleFriendState("reject")}
            />
            <Button
              buttonType="primary"
              width="163px"
              text="친구 수락"
              onClick={() => handleFriendState("accept")}
            />
          </FriendRow>
        </Admit>
      );
    }

    let text = "";
    let onClick: () => void;

    if (user.friend) {
      text = "친구 삭제";
      onClick = () => handleFriendState("delete");
    } else if (user.friendRequestMemberId) {
      text = "친구 요청 취소";
      onClick = () => handleFriendState("cancel");
    } else {
      text = "친구 추가";
      onClick = () => handleFriendState("add");
    }

    return (
      <Admit>
        <Button
          buttonType="secondary"
          width={width}
          text={text}
          onClick={onClick}
        />
      </Admit>
    );
  };

  // 더보기 버튼 메뉴
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [
    { text: "신고하기", onClick: handleReport },
    { text: user.blocked ? "차단 해제" : "차단하기", onClick: handleBlock },
  ];

  // 신고하기 모달 닫기
  const handleReportBoxClose = () => {
    setIsReportBoxOpen(!isReportBoxOpen);
    setIsMoreBoxOpen(false);
    setCheckedItems([]);
  };

  const handleMoreBoxOpen = () => {
    if (isDefault) {
      showLoginAlert();
    } else {
      setIsMoreBoxOpen((prevState) => !prevState);
    }
  };

  const showLoginAlert = () => {
    dispatch(
      setOpenAlertModal({
        icon: "exclamation",
        width: 68,
        height: 58,
        content: "로그인이 필요한 서비스입니다.",
        alt: "경고",
        buttonText: "확인",
      })
    );
  };

  return (
    <Container className={profileType} $backgroundColor={backgroundColor}>
      <Row $profileType={profileType}>
        <ImageContainer>
          <UpdateProfileImage
            type="matching"
            selectedImageIndex={selectedImageIndex}
            setIsProfileListOpen={setIsProfileListOpen}
            isProfileListOpen={isProfileListOpen}
            isEditable={profileType === "wind" || profileType === "normal"}
            onImageClick={handleImageClick}
          />
          {isMobile && (
            <TopContainer
              $isMatching={profileType === "wind" || profileType === "normal"}
            >
              <Top>
                <GameNameDiv>
                  {user.gameName}
                  {(profileType === "me" || profileType === "other") && (
                    <Mic status={isMike} />
                  )}
                </GameNameDiv>
                <Span>{`#${user.tag}`}</Span>
              </Top>
            </TopContainer>
          )}
        </ImageContainer>
        <StyledBox>
          {!isMobile && (
            <TopContainer
              $isMatching={profileType === "wind" || profileType === "normal"}
            >
              <Top>
                {user.gameName}
                <Span>{`#${user.tag}`}</Span>
              </Top>
            </TopContainer>
          )}
          <RankTierWrapper>
            <RankTier type="solo" tier={user.soloTier} rank={user.soloRank} />
            <RankTier type="free" tier={user.freeTier} rank={user.freeRank} />
          </RankTierWrapper>
          {profileType === "wind" ? (
            <StyledBox>
              <GameStyle
                profileType="none"
                gameStyleResponseDTOList={user.gameStyleResponseList}
                mike={isMike as MikeType}
                handleMike={handleMike}
              />
            </StyledBox>
          ) : (
            <UnderRow>
              {/* 칼바람 제외 클릭 시 */}
              <ProfilePositionSection
                profileType={profileType}
                isMobile={isMobile}
                isPositionOpen={isPositionOpen}
                positionValue={{
                  ...positionValue,
                  want: positionValue.want ?? [],
                }}
                handlePosition={handlePosition}
                handlePositionClose={handlePositionClose}
                handleCategoryButtonClick={handleCategoryButtonClick}
              />
              {!isMobile &&
                (profileType === "other" || profileType === "me") &&
                user.championResponseList && (
                  <Champion
                    title={true}
                    font="semiBold14"
                    list={user.championResponseList}
                  />
                )}
            </UnderRow>
          )}
          {(profileType === "normal" ||
            profileType === "other" ||
            (profileType === "me" &&
              user.gameStyleResponseList.length > 0)) && (
            <GameStyle
              profileType={profileType === "normal" ? "none" : profileType}
              gameStyleResponseDTOList={user.gameStyleResponseList}
              mike={isMike as MikeType}
              handleMike={handleMike}
            />
          )}
          {isTablet && !isMobile && renderFriendsButton()}
          {(profileType === "normal" || profileType === "wind") && (
            <Mike>
              마이크
              <Toggle isOn={isMike} onToggle={handleMike} />
            </Mike>
          )}
          {isMobile &&
            (profileType === "other" || profileType === "me") &&
            user.championResponseList && (
              <Champion
                title={true}
                font="medium11"
                list={user.championResponseList}
              />
            )}
        </StyledBox>
        {isMobile && renderFriendsButton()}
      </Row>

      {profileType === "other" && (
        <More>
          {!isTablet && renderFriendsButton()}
          {/* 더보기 버튼 */}
          {memberId !== myId && (
            <MoreDiv ref={moreBoxRef}>
              <MoreBoxButton onClick={handleMoreBoxOpen} />
              {isMoreBoxOpen && (
                <MoreBox
                  items={MoreBoxMenuItems}
                  top={15}
                  left={45}
                  onClose={handleMoreBoxOpen}
                />
              )}
            </MoreDiv>
          )}

          {/* 신고하기 팝업 */}
          {isReportBoxOpen && (
            <FormModal
              type="checkbox"
              title="유저 신고하기"
              width="494px"
              height="721px"
              closeButtonWidth={17}
              closeButtonHeight={17}
              borderRadius="20px"
              onClose={handleReportBoxClose}
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
                      isChecked={checkedItems.includes(data.id)}
                      onArrayChange={handleCheckboxChange}
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
                    onClick={handleRunReport}
                    buttonType="primary"
                    text="신고하기"
                    disabled={checkedItems.length === 0}
                  />
                </ReportButton>
              </div>
            </FormModal>
          )}
        </More>
      )}
    </Container>
  );
};

export default Profile;

const Container = styled.div<{ $backgroundColor?: string }>`
  width: 100%;
  box-sizing: border-box;
  border-radius: 30px;
  padding: 45px;
  background: ${({ $backgroundColor }) =>
    $backgroundColor ? $backgroundColor : theme.colors.gray100};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  box-sizing: border-box;
  position: relative;

  &.other {
    padding: 42px 41px;

    @media (max-width: ${theme.breakpoints.mobile}) {
      min-width: 300px;
      padding: 20px;
      border-radius: 8px;
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 20px;
    border-radius: 8px;

    &.wind {
      height: 330px;
    }
  }
`;

const Row = styled.div<{ $profileType: string }>`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 62px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
`;

const FriendRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 17px;
`;

const UnderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 60px;

  @media (max-width: 1140px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const ImageContainer = styled.div`
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: flex;
  }
`;

const StyledBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 36px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 16px;
  }
`;

const TopContainer = styled.div<{ $isMatching: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  ${theme.fonts.bold32};

  ${({ $isMatching }) =>
    $isMatching &&
    css`
      margin-top: 21px;
    `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-top: 0;
    margin-left: 8px;
    gap: 16px;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  color: ${theme.colors.gray800};
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    ${(props) => props.theme.fonts.bold16};
  }
`;

const GameNameDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Span = styled.span`
  margin-right: 5px;
  color: ${theme.colors.gray500};
  font-size: ${theme.fonts.bold20};
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.semiBold12};
  }
`;

const RankTierWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

const More = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 52px;
  right: 30px;
`;

const Admit = styled.div`
  width: 100%;
`;

const MoreDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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
  margin-top: 21px;
`;

const Msg = styled.div`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular20};
  margin: 28px 0;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium14};
  }
`;

const MsgConfirm = styled(Msg)`
  ${(props) => props.theme.fonts.regular20};
  margin: 80px 0;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium14};
    margin: 32px 0;
  }
`;

const Mike = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  font-size: ${theme.fonts.semiBold14};
  color: ${theme.colors.gray600};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fonts.medium11};
  }
`;
