import React, { useEffect, useState } from "react";
import { theme } from "@/styles/theme";
import Image from "next/image";
import styled, { css } from "styled-components";
import GameStyle from "./GameStyle";
import { POSITIONS } from "@/data/profile";
import Champion from "../readBoard/Champion";
import Toggle from "../common/Toggle";
import Button from "../common/Button";
import Report from "../readBoard/MoreBoxButton";
import FormModal from "../common/FormModal";
import Checkbox from "../common/Checkbox";
import { REPORT_REASON } from "@/data/report";
import Input from "../common/Input";
import ConfirmModal from "../common/ConfirmModal";
import PositionCategory from "../common/PositionCategory";
import MoreBox from "../common/MoreBox";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { User } from "@/interface/profile";
import { PositionState } from "../crBoard/PositionBox";
import { putPosition, putProfileImg } from "@/api/user";
import { setAbbrevTier, setPositionImg } from "@/utils/custom";
import {
  acceptFreindReq,
  cancelFriendReq,
  deleteFriend,
  rejectFreindReq,
  reqFriend,
} from "@/api/friends";
import { useParams } from "next/navigation";
import { blockMember, reportMember, unblockMember } from "@/api/member";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getProfileBgColor } from "@/utils/profile";
import { setMatchInfo } from "@/redux/slices/matchInfo";
import { toLowerCaseString } from "@/utils/string";
import { setUserProfileImg } from "@/redux/slices/userSlice";

type profileType = "normal" | "wind" | "other" | "me";

interface Profile {
  user: User;
  profileType: profileType;
  updateFriendState?: (state: {
    friend: boolean;
    friendRequestMemberId: number | null;
    blocked: boolean;
  }) => void;
}

const Profile: React.FC<Profile> = ({
  profileType,
  user,
  updateFriendState,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const memberId = Number(id);
  const myId = useSelector((state: RootState) => state.user.id);

  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isReportBoxOpen, setIsReportBoxOpen] = useState(false);
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfrimOpen] = useState(false);
  const [isProfileListOpen, setIsProfileListOpen] = useState(false);
  /* 신고 input */
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [reportDetail, setReportDetail] = useState<string>("");

  /* 포지션 */
  const [positions, setPositions] = useState(POSITIONS);
  const [isPositionOpen, setIsPositionOpen] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const matchInfo = useSelector((state: RootState) => state.matchInfo);

  const [selectedBox, setSelectedBox] = useState("");

  /* user부터 가져오는 상태들 */
  const [isMike, setIsMike] = useState<boolean>(user.mike);
  const [positionValue, setPositionValue] = useState<PositionState>({
    main: user.mainP,
    sub: user.subP,
    want: user.subP,
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
      want: user.subP, // 나중에 wantP값 받아서 수정
    });
    setSelectedImageIndex(user.profileImg);
  }, [user]);

  useEffect(() => {
    const gameStyleIds = user.gameStyleResponseDTOList.map(
      (style) => style.gameStyleId
    );

    dispatch(
      setMatchInfo({
        mike: isMike,
        mainP: positionValue.main ?? null,
        subP: positionValue.sub ?? null,
        wantP: positionValue.want ?? null,
        gameStyleResponseDTOList: gameStyleIds,
      })
    );
    console.log("isMike:", isMike);
  }, [isMike, positionValue, dispatch]);

  /* 프로필 이미지 리스트 중 클릭시*/
  const handleImageClick = async (index: number) => {
    setSelectedImageIndex(index);

    await putProfileImg(index);
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
    setIsMike(!isMike);
  };

  const handleMoreBoxOpen = () => {
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  const handleReport = () => {
    setIsReportBoxOpen(!isReportBoxOpen);
    setIsMoreBoxOpen(false);
  };

  const handleRunReport = async () => {
    // 신고하기 api
    if (myId === memberId) return;

    const params = {
      targetMemberId: memberId,
      reportTypeIdList: checkedItems,
      contents: reportDetail,
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
          mainP: newPositionValue.main ?? null,
          subP: newPositionValue.sub ?? null,
          wantP: newPositionValue.want ?? null,
        })
      );
    }
  };

  const handleCategoryButtonClick = (positionId: number) => {
    if (selectedBox) {
      const newPositionValue = {
        ...positionValue,
        [selectedBox]: positionId,
      };
      console.log(positionId);
      setPositionValue(newPositionValue);
      handlePositionChange(newPositionValue);
    }
  };

  const handleFriendState = async (state: string) => {
    try {
      switch (state) {
        case "add":
          await reqFriend(memberId);
          updateFriendState?.({
            friend: false,
            friendRequestMemberId: myId || null,
            blocked: user.blocked,
          });
          break;
        case "cancel":
          await cancelFriendReq(memberId);
          updateFriendState?.({
            friend: false,
            friendRequestMemberId: null,
            blocked: user.blocked,
          });
          break;
        case "accept":
          await acceptFreindReq(memberId);
          updateFriendState?.({
            friend: true,
            friendRequestMemberId: memberId,
            blocked: user.blocked,
          });
          break;
        case "reject":
          await rejectFreindReq(memberId);
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
          text="친구 끊기"
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

  // useEffect(() => {
  //   alert("변경");
  //   renderFriendsButton();
  // }, [friendState.friend, friendState.friendRequestMemberId]);

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

  return (
    <Container className={profileType}>
      <Row>
        <ImageContainer>
          <ProfileImgWrapper $bgColor={getProfileBgColor(selectedImageIndex)}>
            <PersonImage
              data={`/assets/images/profile/profile${selectedImageIndex}.svg`}
              width={136}
              height={136}
            />
          </ProfileImgWrapper>
          {profileType !== "other" && (
            <CameraImgBg
              onClick={() => setIsProfileListOpen(!isProfileListOpen)}
            >
              <CameraImage
                data="/assets/icons/camera_white.svg"
                width={30}
                height={25}
              />
            </CameraImgBg>
          )}
          {/* 프로필 이미지 선택 팝업 */}
          {isProfileListOpen && (
            <ProfileListBox>
              <ProfileListBoxTop>
                프로필 이미지 변경
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
                    <ProfileListImage
                      key={item}
                      data={`/assets/images/profile/profile${item}.svg`}
                      width={70}
                      height={70}
                    />
                  </SelectProfileImgWrapper>
                ))}
              </ProfileList>
            </ProfileListBox>
          )}
        </ImageContainer>
        <StyledBox>
          <TopContainer>
            <Top>
              {user.gameName}
              <Span>{`#${user.tag}`}</Span>
              <Rank>
                <TierImage
                  data={`/assets/images/tier/${toLowerCaseString(
                    user.tier
                  )}.svg`}
                  width={42}
                  height={42}
                />
                {setAbbrevTier(user.tier)}
                {user.tier !== "UNRANKED" && user.rank}
              </Rank>
            </Top>
            {profileType === "other" && (
              <More>
                <Admit>{renderFriendsButton()}</Admit>

                {/* 더보기 버튼 */}
                {memberId !== myId && (
                  <MoreDiv>
                    <Report onClick={handleMoreBoxOpen} />
                    {isMoreBoxOpen && (
                      <MoreBox items={MoreBoxMenuItems} top={15} left={45} />
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
                      user.blocked ? "차단이" : "차단 해제가"
                    } 완료되었습니다.`}</MsgConfirm>
                  </ConfirmModal>
                )}
                {/* 차단 해제하기 확인 팝업 */}
              </More>
            )}
          </TopContainer>
          {profileType === "wind" ? (
            <GameStyle
              profileType="none"
              gameStyleResponseDTOList={user.gameStyleResponseDTOList}
              // mic={user.mic}
              mic={false}
            />
          ) : (
            <UnderRow>
              <Position>
                {(profileType === "other"
                  ? positions.slice(0, 2)
                  : positions
                ).map((position, index) => (
                  <Posi key={index} className={profileType}>
                    {POSITIONS[index].label}
                    <Image
                      src={setPositionImg(
                        index === 0
                          ? positionValue.main ?? 0
                          : index === 1
                          ? positionValue.sub ?? 0
                          : positionValue.want ?? 0
                      )}
                      width={55}
                      height={40}
                      alt="포지션"
                      onClick={() => handlePosition(index)}
                    />
                    {isPositionOpen[index] && (
                      <PositionCategory
                        onClose={() => handlePositionClose(index)}
                        onSelect={handleCategoryButtonClick}
                      />
                    )}
                  </Posi>
                ))}
              </Position>
              {profileType === "other" && user.championResponseDTOList && (
                <Champion
                  title={true}
                  size={14}
                  list={user.championResponseDTOList.map(
                    (champion) => champion.championId
                  )}
                />
              )}
              {profileType === "other" && (
                <Mike>
                  마이크
                  <Toggle isOn={isMike} onToggle={handleMike} disabled={true} />
                </Mike>
              )}
            </UnderRow>
          )}
        </StyledBox>
      </Row>
      {(profileType === "normal" ||
        (profileType === "other" &&
          user.gameStyleResponseDTOList.length > 0)) && (
        <GameStyle
          profileType={profileType === "normal" ? "none" : profileType}
          gameStyleResponseDTOList={user.gameStyleResponseDTOList}
          mic={isMike}
        />
      )}
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-radius: 30px;
  padding: 23px 44px 44px 44px;
  background: ${theme.colors.gray500};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;

  &.other {
    padding: 39px 44px 48px 44px;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 38px;
`;

const FriendRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 17px;
`;

const UnderRow = styled(Row)`
  gap: 54px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  width: 186px;
  height: 186px;
  border-radius: 50%;
  background: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PersonImage = styled.object`
  margin-top: 5px;
  filter: drop-shadow(-4px 10px 10px rgba(63, 53, 78, 0.582));
  pointer-events: none;
`;

const CameraImgBg = styled.div`
  position: relative;
  width: 54px;
  height: 54px;
  background: #000000a1;
  box-shadow: 0 0 3.06px 0 #00000040;
  border-radius: 50%;
  top: -51px;
`;

const CameraImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const ProfileListBox = styled.div`
  width: 527px;
  height: 335px;
  display: flex;
  flex-direction: column;
  padding: 26px;
  gap: 10px;
  justify-content: center;
  align-items: flex-end;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.64);
  position: absolute;
  top: 205px;
  left: 10px;
  z-index: 100;
`;

const ProfileListBoxTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${theme.fonts.regular20};
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
      opacity: 0.5;
    `}

  &:hover {
    filter: drop-shadow(0px 4px 10px rgba(138, 117, 255, 0.7));
    transition: box-shadow 0.3s ease-in-out;
  }
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
`;

const TopContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  color: ${theme.colors.gray100};
  font-size: ${theme.fonts.bold32};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  color: ${theme.colors.gray100};
  font-size: ${theme.fonts.bold32};
  white-space: nowrap;
`;

const Span = styled.span`
  margin-right: 5px;
  color: ${theme.colors.gray300};
  font-size: ${theme.fonts.regular25};
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  color: #44515c;
  font-size: ${theme.fonts.regular25};
  font-weight: 300;
  gap: 10px;
`;

const TierImage = styled.object`
  pointer-events: none;
`;

const More = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 20px;
`;

const Admit = styled.div``;

const MoreDiv = styled.div`
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

const Position = styled.div`
  display: flex;
  gap: 33px;
  align-items: center;
`;

const Posi = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  font-size: ${theme.fonts.regular14};
  position: relative;

  &.other {
    font-size: ${theme.fonts.semiBold14};
  }
`;

const Mike = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  font-size: ${theme.fonts.semiBold14};
`;
