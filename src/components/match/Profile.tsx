import React, { useEffect, useRef, useState } from "react";
import { theme } from "@/styles/theme";
import Image from "next/image";
import styled, { css } from "styled-components";
import GameStyle from "./GameStyle";
import { POSITIONS } from "@/constants/profile";
import Champion from "../readBoard/Champion";
import Toggle from "../common/Toggle";
import Button from "../common/Button";
import MoreBoxButton from "../readBoard/MoreBoxButton";
import FormModal from "../common/FormModal";
import Checkbox from "../common/Checkbox";
import { REPORT_REASON } from "@/constants/report";
import Input from "../common/Input";
import ConfirmModal from "../common/ConfirmModal";
import PositionCategory from "../common/PositionCategory";
import MoreBox from "../common/MoreBox";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { User } from "@/interface/profile";
import { PositionState } from "../crBoard/PositionBox";
import { setPositionImg } from "@/utils/custom";
import { useParams } from "next/navigation";
import { reportMember } from "@/api/report/report";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getProfileBgColor } from "@/utils/profile";
import { setMatchInfo, updateMike } from "@/redux/slices/matchInfo";
import { setUserProfileImg } from "@/redux/slices/userSlice";
import { putPosition, putProfileImage } from "@/api/user/profile/put";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "@/api/friend/request";
import { deleteFriend } from "@/api/friend/delete";
import { blockMember, unblockMember } from "@/api/block/block";
import { Mike as MikeType } from "@/types/user/mike";
import { Position, PositionType } from "@/types/position/position";
import RankTier from "../common/RankTier";
import Alert from "../common/Alert";
import useMediaQueries from "@/hooks/useMediaQueries";

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
  const [isPositionOpen, setIsPositionOpen] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
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

  useEffect(() => {
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
  }, [isMike, positionValue, dispatch]);

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
  const handlePosition = async (index: number) => {
    // console.log(index, "=====", profileType);
    if (profileType !== "other") {
      setIsPositionOpen((prev) =>
        prev.map((isOpen, i) => (i === index ? !isOpen : false))
      );
      setSelectedBox(index === 0 ? "main" : index === 1 ? "sub" : "want");
    }
  };

  // 포지션 선택창 닫기
  const handlePositionClose = (index: number) => {
    if (profileType !== "other") {
      setIsPositionOpen((prev) =>
        prev.map((isOpen, i) => (i === index ? false : isOpen))
      );
    }
  };

  // 포지션 선택해 변경하기
  const handlePositionChange = async (newPositionValue: PositionState) => {
    // setPositionValue(newPositionValue);
    if (profileType === "me" && newPositionValue.main && newPositionValue.sub) {
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
    selectedValues: Position | (Position | null)[]
  ) => {
    if (selectedBox) {
      const newPositionValue = {
        ...positionValue,
        [selectedBox]: selectedValues,
      };
      setPositionValue(newPositionValue);
      handlePositionChange(newPositionValue);
    }
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
          width="218px"
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
                width="163px"
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
          );
        } else {
          return (
            <Button
              buttonType="secondary"
              width="218px"
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
          width="218px"
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
          <ProfileImgWrapper>
            <PersonImgWrapper $bgColor={getProfileBgColor(selectedImageIndex)}>
              <PersonImage
                data={`/assets/images/profile/profile${selectedImageIndex}.svg`}
                width={136}
                height={136}
              />
            </PersonImgWrapper>
            {profileType !== "other" && (
              <CameraImgBg
                onClick={() => setIsProfileListOpen(!isProfileListOpen)}
              >
                <CameraImage
                  data="/assets/icons/edit_pencil.svg"
                  width={35}
                  height={30}
                />
              </CameraImgBg>
            )}
          </ProfileImgWrapper>
          {/* 프로필 이미지 선택 팝업 */}
          {isProfileListOpen && (
            <ProfileListBox>
              <ProfileListBoxTop>
                프로필 이미지 선택
                <Image
                  src="/assets/icons/close_white.svg"
                  width={14}
                  height={14}
                  alt="닫기"
                  onClick={() => setIsProfileListOpen(false)}
                />
              </ProfileListBoxTop>
              <ProfileList>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <SelectProfileImgWrapper
                    key={item}
                    $bgColor={getProfileBgColor(item)}
                    $isSelected={item === selectedImageIndex}
                    onClick={() => handleImageClick(item)}
                  >
                    {item === selectedImageIndex && (
                      <CheckIcon
                        width={22}
                        height={22}
                        data={`/assets/icons/check_white.svg`}
                      />
                    )}
                    <ProfileListImage
                      key={item}
                      data={`/assets/images/profile/profile${item}.svg`}
                      width={isMobile ? 40 : 70}
                      height={isMobile ? 40 : 70}
                    />
                  </SelectProfileImgWrapper>
                ))}
              </ProfileList>
            </ProfileListBox>
          )}

          {isMobile && (
            <TopContainer
              $isMatching={profileType === "wind" || profileType === "normal"}
            >
              <Top>
                {user.gameName}
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
                  {POSITIONS.slice(0, 2).map((position, index) => (
                    <Posi key={index} className={profileType} $isWantP={false}>
                      {position.label}
                      <Image
                        src={setPositionImg(
                          index === 0
                            ? positionValue.main ?? "ANY"
                            : index === 1
                            ? positionValue.sub ?? "ANY"
                            : (positionValue.want && positionValue.want[0]) ??
                              "ANY"
                        )}
                        width={!isMobile ? 55 : 41}
                        height={!isMobile ? 40 : 32}
                        alt="포지션"
                        onClick={() => handlePosition(index)}
                      />
                      {isPositionOpen[index] && (
                        <PositionCategory
                          value={
                            index === 0
                              ? positionValue.main ?? "ANY"
                              : index === 1
                              ? positionValue.sub ?? "ANY"
                              : (positionValue.want && positionValue.want[0]) ??
                                "ANY"
                          }
                          onClose={() => handlePositionClose(index)}
                          onSelect={handleCategoryButtonClick}
                        />
                      )}
                    </Posi>
                  ))}
                </PosiWrap>

                {/* 내가 찾는 포지션 */}
                <PosiWrap>
                  <Posi key={2} className={profileType} $isWantP={true}>
                    {POSITIONS[2].label}
                    <Image
                      src={setPositionImg(
                        (positionValue.want && positionValue.want[0]) ?? "ANY"
                      )}
                      width={!isMobile ? 55 : 41}
                      height={!isMobile ? 40 : 32}
                      alt="포지션"
                      onClick={() => handlePosition(2)}
                    />
                    {isPositionOpen[2] && (
                      <PositionCategory
                        value={
                          (positionValue.want && positionValue.want[0]) ?? "ANY"
                        }
                        onClose={() => handlePositionClose(2)}
                        onSelect={handleCategoryButtonClick}
                      />
                    )}
                  </Posi>
                </PosiWrap>
              </Positions>
              {/* TODO 최근 선호 챔피언 */}
              {(profileType === "other" || profileType === "me") &&
                user.championResponseList && (
                  <Champion
                    title={true}
                    font="regular14"
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
          <Mike>
            마이크
            <Toggle
              isOn={isMike}
              onToggle={handleMike}
              disabled={profileType === "other"}
            />
          </Mike>
        </StyledBox>
      </Row>

      {profileType === "other" && (
        <More>
          {!isDefault && <Admit>{renderFriendsButton()}</Admit>}
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
  /* height: 445px; */
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
  position: relative;

  &.other {
    padding: 42px 41px;
  }
  @media (max-width: 700px) {
    padding: 20px;

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
  ${({ $profileType }) =>
    $profileType === "other" &&
    css`
      margin-bottom: 20px;
    `}
  @media (max-width: 700px) {
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
`;

const ImageContainer = styled.div`
  position: relative;
  @media (max-width: 700px) {
    display: flex;
  }
`;
const ProfileImgWrapper = styled.div`
  @media (max-width: 700px) {
    display: flex;
    position: relative;
  }
`;

const PersonImgWrapper = styled.div<{ $bgColor: string }>`
  width: 186px;
  height: 186px;
  border-radius: 50%;
  background: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 700px) {
    width: 52px;
    height: 52px;
  }
`;

const PersonImage = styled.object`
  margin-top: 5px;
  filter: drop-shadow(-4px 10px 10px rgba(63, 53, 78, 0.582));
  pointer-events: none;
  @media (max-width: 700px) {
    width: 35px;
    margin-top: 0;
  }
`;

const CameraImgBg = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  background: #000000a1;
  box-shadow: 0 0 3.06px 0 #00000040;
  border-radius: 50%;
  top: -51px;
  @media (max-width: 700px) {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 35px;
  }
`;

const CameraImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  @media (max-width: 700px) {
    width: 10px;
    height: 10px;
  }
`;

const ProfileListBox = styled.div`
  width: 527px;
  height: 335px;
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 10px;
  justify-content: center;
  align-items: flex-end;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.64);
  position: absolute;
  top: 205px;
  left: 10px;
  z-index: 100;
  /* Background Blur */
  box-shadow: 0 4px 8.9px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);
`;

const ProfileListBoxTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${theme.fonts.bold20};
  margin-bottom: 20px;
`;

const ProfileList = styled.div`
  width: 100%;
  height: 100%;
  row-gap: 30px;
  column-gap: 30px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  justify-items: center;
`;

const SelectProfileImgWrapper = styled.div<{
  $bgColor: string;
  $isSelected: boolean;
}>`
  position: relative;
  width: 96px;
  height: 96px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
  ${({ $isSelected }) =>
    $isSelected &&
    css`
      border: 3.41px solid ${theme.colors.white};
    `}

  &:hover {
    filter: drop-shadow(0px 4px 10px rgba(138, 117, 255, 0.7));
    transition: box-shadow 0.3s ease-in-out;
  }
`;

const CheckIcon = styled.object`
  position: absolute;
  top: 15px;
  left: 10px;
  z-index: 10;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  background: ${theme.colors.violet600};
  border-radius: 50%;
  border: 3.41px solid ${theme.colors.white};
`;

const ProfileListImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
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

const Admit = styled.div``;

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
  gap: 8px;
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const PosiWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  background-color: white;
  width: 100%;
  border-radius: 6px;
  padding: 12px 20px;
`;

const Posi = styled.div<{ $isWantP: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
  font-size: ${theme.fonts.medium16};
  color: ${theme.colors.gray800};
  position: relative;

  &.other {
    font-size: ${theme.fonts.medium16};
  }

  ${({ $isWantP }) =>
    $isWantP &&
    css`
      /* margin-left: 36px; */
    `}

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

const Mike = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  font-size: ${theme.fonts.semiBold14};
  @media (max-width: 700px) {
    font-size: ${theme.fonts.medium11};
  }
`;
