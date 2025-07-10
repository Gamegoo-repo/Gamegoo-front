import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useParams } from "next/navigation";
import styled, { css } from "styled-components";

import {
  acceptFriendRequest,
  blockMember,
  cancelFriendRequest,
  deleteFriend,
  putPosition,
  putProfileImage,
  rejectFriendRequest,
  reportMember,
  sendFriendRequest,
  unblockMember,
} from "@/api";
import {
  Alert,
  Button,
  Champion,
  Checkbox,
  ConfirmModal,
  FormModal,
  Input,
  Mic,
  MoreBox,
  MoreBoxButton,
  PositionCategory,
  RankTier,
  Toggle,
  UpdateProfileImage,
} from "@/components";
import { POSITIONS, REPORT_REASON } from "@/constants";
import useMediaQueries from "@/hooks/useMediaQueries";
import { setMatchInfo, updateMike } from "@/redux/slices/matchInfo";
import { setUserProfileImg } from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";
import { setPositionImg } from "@/utils/custom";

import GameStyle from "../match/GameStyle";

import type { RootState } from "@/redux/store";
import type {
  Mike as MikeType,
  MoreBoxMenuItems,
  Position as PositionType,
  User,
} from "@/types";
import type { PositionState } from "../crBoard/PositionBox";

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
  const isMobileButton = useMediaQueries({ breakpoint: 950 });
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const dispatch = useDispatch();
  const { id } = useParams();
  const memberId = Number(id);
  const myId = useSelector((state: RootState) => state.user.id);
  const moreBoxRef = useRef<HTMLDivElement | null>(null);

  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isReportBoxOpen, setIsReportBoxOpen] = useState(false);
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfrimOpen] = useState(false);
  const [isProfileListOpen, setIsProfileListOpen] = useState(false);
  /* 신고 input */
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [reportDetail, setReportDetail] = useState<string>("");

  /* 포지션 */
  const [isPositionOpen, setIsPositionOpen] = useState({
    main: false,
    sub: false,
    want: [false, false], // 최대 2개의 want 포지션
  });
  const [selectedBox, setSelectedBox] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const matchInfo = useSelector((state: RootState) => state.matchInfo);

  /* user부터 가져오는 상태들 */
  const [isMike, setIsMike] = useState<MikeType>(user.mike);
  const [positionValue, setPositionValue] = useState<PositionState>({
    main: user.mainP,
    sub: user.subP,
    want: user.wantP,
  });
  /* 선택된 현재 프로필 이미지 */
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    user.profileImg
  );

  // 상위 컴포넌트에서 user 변경 시 업데이트
  useEffect(() => {
    setIsMike(user.mike);
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

  /* 프로필 이미지 리스트 중 클릭시*/
  const handleImageClick = async (index: number) => {
    setSelectedImageIndex(index);

    await putProfileImage(index);
    // const newUserData = await getProfile();
    dispatch(setUserProfileImg(index));
    localStorage.setItem("profileImg", index + "");

    setTimeout(() => {
      setIsProfileListOpen(false);
    }, 300); // 300ms 후에 창이 닫히도록 설정
  };

  useEffect(() => {
    setIsMike(isMike);
  }, [isMike]);

  const handleMike = () => {
    setIsMike(isMike === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE");
    dispatch(updateMike(isMike));
  };

  const handleReport = () => {
    setIsReportBoxOpen(!isReportBoxOpen);
    setIsMoreBoxOpen(false);
  };

  const handleRunReport = async () => {
    // 신고하기 api
    if (myId === memberId) return;

    const params = {
      memberId: memberId,
      reportCodeList: checkedItems,
      contents: reportDetail,
      pathCode: 3, // PROFILE
    };

    setIsMoreBoxOpen(false);
    try {
      await reportMember(params);
      setIsReportBoxOpen(!isReportBoxOpen);
    } catch (error) {
      console.error("에러:", error);
    }
  };

  const handleBlock = async () => {
    setIsBlockBoxOpen(!isBlockBoxOpen);
    setIsMoreBoxOpen(false);
  };

  const handleRunBlock = async () => {
    // 차단하기 api
    setIsBlockBoxOpen(false);
    if (user.blocked) {
      await unblockMember(memberId);
      updateFriendState?.({
        friend: user.friend,
        friendRequestMemberId: user.friendRequestMemberId,
        blocked: false,
      });
    } else {
      await blockMember(memberId);
      updateFriendState?.({
        friend: user.friend,
        friendRequestMemberId: user.friendRequestMemberId,
        blocked: true,
      });
    }
    setIsBlockConfrimOpen(true);
  };

  /* 포지션 선택창 관련 함수*/
  // 포지션 선택창 열기 (포지션 클릭시 동작)
  const handlePosition = (type: "main" | "sub" | "want", index: number = 0) => {
    if (profileType === "other") return;

    setSelectedBox(type);

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

  // 포지션 선택해 변경하기
  const handlePositionChange = async (newPositionValue: PositionState) => {
    if (
      profileType !== "other" &&
      newPositionValue.main &&
      newPositionValue.sub
    ) {
      try {
        // 포지션 변경 API 호출
        await putPosition({
          mainP: newPositionValue.main,
          subP: newPositionValue.sub,
          wantP: newPositionValue.want || [],
        });

        // 포지션 상태 업데이트
        setPositionValue(newPositionValue);
      } catch (error) {
        console.error("포지션 변경 실패:", error);
      }
    } else if (profileType === "normal" || profileType === "wind") {
      dispatch(
        setMatchInfo({
          ...matchInfo,
          mainP: newPositionValue.main ?? "ANY",
          subP: newPositionValue.sub ?? "ANY",
          wantP: newPositionValue.want ?? ["ANY", "ANY"],
        })
      );
    }
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

  const handleFriendState = async (state: string) => {
    try {
      switch (state) {
        case "add":
          await sendFriendRequest(memberId);
          updateFriendState?.({
            friend: false,
            friendRequestMemberId: myId || null,
            blocked: user.blocked,
          });
          break;
        case "cancel":
          await cancelFriendRequest(memberId);
          updateFriendState?.({
            friend: false,
            friendRequestMemberId: null,
            blocked: user.blocked,
          });
          break;
        case "accept":
          await acceptFriendRequest(memberId);
          updateFriendState?.({
            friend: true,
            friendRequestMemberId: memberId,
            blocked: user.blocked,
          });
          break;
        case "reject":
          await rejectFriendRequest(memberId);
          updateFriendState?.({
            friend: false,
            friendRequestMemberId: null,
            blocked: user.blocked,
          });
          break;
        case "delete":
          await deleteFriend(memberId);
          updateFriendState?.({
            friend: false,
            friendRequestMemberId: null,
            blocked: user.blocked,
          });
          break;
        default:
          throw new Error("존재하지 않는 친구 상태입니다.");
      }
    } catch (error) {
      console.error("Error handling friend state:", error);
    }
  };

  // 친구 추가
  const renderFriendsButton = () => {
    // 친구 추가
    // 친구 삭제 (끊기)
    // 친구 요청 전송 (나)
    // 친구 요청 취소 (나)
    // 친구 수락/거절 (상대)
    // 자기 자신 프로필
    if (user.blocked) {
      return (
        // <Button
        //   buttonType="secondary"
        //   width="218px"
        //   text="차단된 유저"
        //   disabled={true}
        // />
        null
      );
    }
    if (user.friend) {
      return (
        <Button
          buttonType="secondary"
          width={isMobile ? "100%" : "218px"}
          text="친구 삭제"
          onClick={() => handleFriendState("delete")}
        />
      );
    } else {
      if (user.friendRequestMemberId) {
        if (user.friendRequestMemberId === memberId) {
          return (
            <FriendRow>
              <Button
                buttonType="secondary"
                width={isMobile ? "100%" : "163px"}
                text="친구 거절"
                onClick={() => handleFriendState("reject")}
              />
              <Button
                buttonType="primary"
                width={isMobile ? "100%" : "163px"}
                text="친구 수락"
                onClick={() => handleFriendState("accept")}
              />
            </FriendRow>
          );
        } else {
          return (
            <Button
              buttonType="secondary"
              width={isMobile ? "100%" : "218px"}
              text="친구 요청 취소"
              onClick={() => handleFriendState("cancel")}
            />
          );
        }
      } else if (memberId === myId) {
        return null;
      }
      return (
        <Button
          buttonType="secondary"
          width={isMobile ? "100%" : "218px"}
          text="친구 추가"
          onClick={() => handleFriendState("add")}
        />
      );
    }
  };

  // 더보기 버튼 메뉴
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [
    { text: "신고하기", onClick: handleReport },
    { text: user.blocked ? "차단 해제" : "차단하기", onClick: handleBlock },
  ];

  // 신고하기 체크
  const handleCheckboxChange = (checked: number) => {
    setCheckedItems((prev) =>
      prev.includes(checked)
        ? prev.filter((c) => c !== checked)
        : [...prev, checked]
    );
  };

  // 신고하기 모달 닫기
  const handleReportBoxClose = () => {
    setIsReportBoxOpen(!isReportBoxOpen);
    setIsMoreBoxOpen(false);
    setCheckedItems([]);
  };

  // 더보기 외부 클릭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreBoxRef.current &&
        !moreBoxRef.current.contains(event.target as Node)
      ) {
        setIsMoreBoxOpen(false);
      }
    };

    if (isMoreBoxOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreBoxOpen]);

  const handleMoreBoxOpen = () => {
    if (isDefault) {
      setShowAlert(true);
    } else {
      setIsMoreBoxOpen((prevState) => !prevState);
    }
  };

  return (
    <Container className={profileType} $backgroundColor={backgroundColor}>
      {showAlert && (
        <Alert
          icon="exclamation"
          width={68}
          height={58}
          content="로그인이 필요한 서비스입니다."
          alt="경고"
          onClose={() => setShowAlert(false)}
          buttonText="확인"
        />
      )}
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
                mike={isMike}
                handleMike={handleMike}
              />
            </StyledBox>
          ) : (
            <UnderRow>
              {/* 칼바람 제외 클릭 시 */}
              <Positions>
                {/* 주 포지션 + 부 포지션 */}
                <PosiWrap>
                  {POSITIONS.slice(0, 2).map((position, index) => {
                    const type = index === 0 ? "main" : "sub";

                    return (
                      <Posi
                        key={index}
                        className={profileType}
                        $isWantP={false}
                      >
                        {position.label}
                        <PosiItem>
                          <Image
                            src={setPositionImg(
                              type === "main"
                                ? (positionValue.main ?? "ANY")
                                : (positionValue.sub ?? "ANY")
                            )}
                            width={!isMobile ? 55 : 22}
                            height={!isMobile ? 40 : 22}
                            alt="포지션"
                            onClick={() => handlePosition(type)}
                          />
                          {isPositionOpen[type] && (
                            <PositionCategory
                              selectedBox={type}
                              value={positionValue[type] ?? "ANY"}
                              onClose={() => handlePositionClose(type)}
                              onSelect={(val) =>
                                handleCategoryButtonClick(val, type)
                              }
                            />
                          )}
                        </PosiItem>
                      </Posi>
                    );
                  })}
                </PosiWrap>

                {/* 내가 찾는 포지션 */}
                <PosiWrap>
                  <Posi key={2} className={profileType} $isWantP={true}>
                    {POSITIONS[2].label}
                    <PosiRow>
                      {positionValue?.want && positionValue?.want.length > 0 ? (
                        positionValue.want
                          .concat(Array(2).fill(null))
                          .slice(0, 2)
                          .map((posi, index) => (
                            <PosiItem key={index}>
                              {posi ? (
                                <Image
                                  src={setPositionImg(posi)}
                                  width={!isMobile ? 48 : 22}
                                  height={!isMobile ? 40 : 22}
                                  alt="포지션"
                                  onClick={() => handlePosition("want", index)}
                                />
                              ) : (
                                ["wind", "normal"].includes(profileType) && (
                                  <Plus
                                    onClick={() =>
                                      handlePosition("want", index)
                                    }
                                  >
                                    <Image
                                      src="/assets/icons/plus_violet.svg"
                                      width={!isMobile ? 16 : 14}
                                      height={!isMobile ? 16 : 14}
                                      alt=""
                                    />
                                  </Plus>
                                )
                              )}
                              {/* PositionCategory 열기 조건 */}
                              {isPositionOpen.want[index] && (
                                <PositionCategory
                                  selectedBox="want"
                                  value={posi}
                                  onClose={() =>
                                    handlePositionClose("want", index)
                                  }
                                  onSelect={(val) =>
                                    handleCategoryButtonClick(
                                      val,
                                      "want",
                                      index
                                    )
                                  }
                                  usedPositions={
                                    positionValue.want?.filter(
                                      (pos, i): pos is PositionType =>
                                        i !== index && pos !== null
                                    ) ?? []
                                  }
                                />
                              )}
                            </PosiItem>
                          ))
                      ) : // 매칭 프로필 - 포지션 선택, 조회 프로필 - ANY(*) 지정
                      ["wind", "normal"].includes(profileType) ? (
                        <PosiItem key="default-plus">
                          <Plus onClick={() => handlePosition("want", 0)}>
                            <Image
                              src="/assets/icons/plus_violet.svg"
                              width={!isMobile ? 16 : 14}
                              height={!isMobile ? 16 : 14}
                              alt=""
                            />
                          </Plus>
                          {isPositionOpen.want[0] && (
                            <PositionCategory
                              selectedBox="want"
                              value={null}
                              onClose={() => handlePositionClose("want", 0)}
                              onSelect={(val) =>
                                handleCategoryButtonClick(val, "want", 0)
                              }
                              usedPositions={[]}
                            />
                          )}
                        </PosiItem>
                      ) : (
                        <PosiItem key="any-position">
                          <Image
                            src={setPositionImg("ANY")}
                            width={!isMobile ? 48 : 22}
                            height={!isMobile ? 40 : 22}
                            alt="포지션"
                          />
                        </PosiItem>
                      )}
                    </PosiRow>
                  </Posi>
                </PosiWrap>
              </Positions>
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
              mike={isMike}
              handleMike={handleMike}
            />
          )}
          {!isDefault && isMobileButton && !isMobile && (
            <Admit>{renderFriendsButton()}</Admit>
          )}
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
        {!isDefault &&
          isMobile &&
          (profileType === "me" || profileType === "other") && (
            <Admit>{renderFriendsButton()}</Admit>
          )}
      </Row>

      {profileType === "other" && (
        <More>
          {!isDefault && !isMobileButton && (
            <Admit>{renderFriendsButton()}</Admit>
          )}
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
          {/* 차단하기 팝업 */}
          {isBlockBoxOpen && (
            <ConfirmModal
              width="540px"
              primaryButtonText="예"
              secondaryButtonText="아니요"
              onPrimaryClick={() => handleRunBlock()}
              onSecondaryClick={() => {
                setIsBlockBoxOpen(false);
              }}
            >
              {user.blocked ? (
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
          {/* 차단/차단 해제 확인 팝업 */}
          {isBlockConfirmOpen && (
            <ConfirmModal
              width="540px"
              primaryButtonText="확인"
              onPrimaryClick={() => {
                setIsBlockConfrimOpen(false);
              }}
            >
              <MsgConfirm>{`${
                user.blocked ? "차단이" : "차단 해제가"
              } 완료되었습니다.`}</MsgConfirm>
            </ConfirmModal>
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

    @media (max-width: 700px) {
      min-width: 300px;
      padding: 20px;
      border-radius: 8px;
    }
  }

  @media (max-width: 700px) {
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

  @media (max-width: 900px) {
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

  @media (max-width: 700px) {
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
  @media (max-width: 700px) {
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

  @media (max-width: 700px) {
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

  @media (max-width: 700px) {
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
  @media (max-width: 700px) {
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
`;

const MsgConfirm = styled(Msg)`
  ${(props) => props.theme.fonts.regular20};
  margin: 80px 0;
`;

const Positions = styled.div`
  display: flex;
  align-items: center;
  width: 412px;
  gap: 12px;
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const PosiWrap = styled.div`
  height: 104px;
  display: flex;
  justify-content: center;
  gap: 12px;
  background-color: ${theme.colors.white};
  width: 100%;
  border-radius: 6px;
  padding: 16px 32px 12px 32px;

  @media (max-width: 700px) {
    height: 69px;
    padding: 12px 20px 8px 20px;
  }
`;

const Posi = styled.div<{ $isWantP: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  font-size: ${theme.fonts.medium16};
  color: ${theme.colors.gray800};
  white-space: nowrap;

  @media (max-width: 700px) {
    font-size: ${theme.fonts.medium11};
    gap: 9px;
    ${({ $isWantP }) =>
      $isWantP &&
      css`
        margin-left: 0px;
      `};
  }
`;

const PosiRow = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const PosiItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Plus = styled.div`
  display: flex;
  width: 48px;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  background: ${theme.colors.violet100};

  @media (max-width: 700px) {
    width: 32px;
    height: 24px;
  }
`;

const Mike = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  font-size: ${theme.fonts.semiBold14};
  color: ${theme.colors.gray600};

  @media (max-width: 700px) {
    font-size: ${theme.fonts.medium11};
  }
`;
