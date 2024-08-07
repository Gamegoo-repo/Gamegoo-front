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

type profileType = "fun" | "hard" | "other" | "me";

interface Champion {
  id: number;
  value: string;
}

// interface User {
//   image: string;
//   account: string;
//   tag: string;
//   tier: string;
//   mic: boolean;
//   champions?: Champion[];
//   gameStyleResponseDTOList: string[];
// }

interface Profile {
  user: User;
  profileType: profileType;
}

const Profile: React.FC<Profile> = ({ profileType, user }) => {
  // const [isMike, setIsMike] = useState(user.mic);
  const [isMike, setIsMike] = useState(false);
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isReportBoxOpen, setIsReportBoxOpen] = useState(false);
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfrimOpen] = useState(false);
  const [isProfileListOpen, setIsProfileListOpen] = useState(false);
  const [reportDetail, setReportDetail] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  /* 포지션 */
  const [positions, setPositions] = useState(POSITIONS);
  const [isPositionOpen, setIsPositionOpen] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  /* 선택된 현재 프로필 이미지 */
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    parseInt(user.profileImg.slice(-1))
  );

  /* 프로필 이미지 리스트 중 클릭시*/
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index + 1);

    setTimeout(() => {
      setIsProfileListOpen(false);
    }, 300); // 300ms 후에 창이 닫히도록 설정
  };

  // useEffect(() => {
  //   setIsMike(user.mic);
  // }, [user.mic]);

  const handleMike = () => {
    setIsMike(!isMike);
  };

  const handleMoreBoxOpen = () => {
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  const handleReport = () => {
    // 신고하기 api
    setIsReportBoxOpen(!isReportBoxOpen);
    setIsMoreBoxOpen(false);
  };

  const handleBlock = () => {
    // 차단하기 api
    setIsBlockBoxOpen(!isBlockBoxOpen);
    setIsMoreBoxOpen(false);
  };

  /* 포지션 선택창 관련 함수*/
  // 포지션 선택창 열기 (포지션 클릭시 동작)
  const handlePosition = (index: number) => {
    setIsPositionOpen((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : false))
    );
  };

  // 포지션 선택창 닫기
  const handlePositionClose = (index: number) => {
    setIsPositionOpen((prev) =>
      prev.map((isOpen, i) => (i === index ? false : isOpen))
    );
  };

  // 포지션 선택해 변경하기
  const handlePositionSelect = (index: number, newPosition: string) => {
    setPositions((prev) =>
      prev.map((pos, i) =>
        i === index ? { ...pos, position: newPosition } : pos
      )
    );
  };

  // 더보기 버튼 메뉴
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [
    { text: "신고하기", onClick: handleReport },
    { text: "차단하기", onClick: handleBlock },
  ];

  // 신고하기 체크
  const handleCheckboxChange = (checked: string) => {
    setCheckedItems((prev) =>
      prev.includes(checked)
        ? prev.filter((r) => r !== checked)
        : [...prev, checked]
    );
  };

  return (
    <Container className={profileType}>
      <Row>
        <ImageContainer>
          <ProfileImage>
            <PersonImage
              src={`/assets/images/profile/profile${selectedImageIndex}.svg`}
              width={136}
              height={136}
              alt="프로필"
            />
          </ProfileImage>
          {profileType !== "other" && (
            <CameraImage
              src="/assets/icons/profile_camera.svg"
              width={54}
              height={54}
              alt="프로필 이미지"
              onClick={() => setIsProfileListOpen(!isProfileListOpen)}
            />
          )}
          {/* 프로필 이미지 선택 팝업 */}
          {isProfileListOpen && (
            <ProfileListBox>
              <Image
                src="/assets/icons/close_white.svg"
                width={14}
                height={14}
                alt="닫기"
                onClick={() => setIsProfileListOpen(false)}
              />
              <ProfileList>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                  <ProfileListImage
                    key={index}
                    src={`/assets/images/profile/profile${item}.svg`}
                    width={104}
                    height={104}
                    alt="프로필 이미지"
                    $isSelected={index + 1 === selectedImageIndex}
                    onClick={() => handleImageClick(index)}
                  />
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
                <Image
                  src={`/assets/images/rank_${user.tier}.svg`}
                  width={52}
                  height={52}
                  alt="B3"
                />
                {user.tier}
              </Rank>
            </Top>
            {profileType === "other" && (
              <More>
                <Admit>
                  <Button
                    buttonType="primary"
                    width="218px"
                    text="친구 요청 수락하기"
                  />
                  {/* <Button buttonType="secondary" width="218px" text="친구 추가" />
                <Button
                  buttonType="secondary"
                  width="218px"
                  disabled={true}
                  text="친구 요청 전송됨"
                /> */}
                </Admit>
                {/* 더보기 버튼 */}
                <MoreDiv>
                  <Report onClick={handleMoreBoxOpen} />
                  {isMoreBoxOpen && (
                    <MoreBox items={MoreBoxMenuItems} top={15} left={45} />
                  )}
                </MoreDiv>
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
                    onClose={handleReport}
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
                            isArraychecked={checkedItems.includes(data.text)}
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
                          onClick={handleReport}
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
                    onPrimaryClick={() => {
                      setIsBlockBoxOpen(false);
                      setIsBlockConfrimOpen(true);
                    }}
                    onSecondaryClick={() => {
                      setIsBlockBoxOpen(false);
                    }}
                  >
                    <Msg>
                      {`차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다.\n\n또한, 다시 차단 해제할 수 없습니다.\n차단하시겠습니까?`}
                    </Msg>
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
                    <MsgConfirm>{`차단이 완료되었습니다.`}</MsgConfirm>
                  </ConfirmModal>
                )}
              </More>
            )}
          </TopContainer>
          {profileType === "fun" ? (
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
                  <>
                    <Posi key={index} className={profileType}>
                      {position.label}
                      <Image
                        src={`/assets/icons/position_${position.position}_purple.svg`}
                        width={55}
                        height={40}
                        alt="포지션"
                        onClick={() => handlePosition(index)}
                      />
                      {isPositionOpen[index] && (
                        <PositionCategory
                          onClose={() => handlePositionClose(index)}
                          onSelect={(newPosition: string) =>
                            handlePositionSelect(index, newPosition)
                          }
                          boxName="position"
                        />
                      )}
                    </Posi>
                  </>
                ))}
              </Position>
              {user.championResponseDTOList && (
                <Champion size={14} list={user.championResponseDTOList} />
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
      {(profileType === "hard" || profileType === "other") && (
        <GameStyle
          profileType={profileType === "hard" ? "none" : profileType}
          gameStyleResponseDTOList={user.gameStyleResponseDTOList}
          // mic={user.mic}
          mic={false}
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
  align-items: center;
  gap: 38px;
`;

const UnderRow = styled(Row)`
  gap: 54px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const ProfileImage = styled.div`
  width: 186px;
  height: 186px;
  border-radius: 93px;
  background: ${theme.colors.purple300};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PersonImage = styled(Image)`
  margin-top: 5px;
  filter: drop-shadow(-4px 10px 10px rgba(63, 53, 78, 0.582));
`;

const CameraImage = styled(Image)`
  position: absolute;
  bottom: 0px;
  left: 0px;
`;

const ProfileListBox = styled.div`
  width: 527px;
  height: 335px;
  display: flex;
  flex-direction: column;
  padding: 21px;
  gap: 10px;
  justify-content: center;
  align-items: flex-end;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.64);
  position: fixed;
  top: 500px;
  left: 20px;
  z-index: 100;
`;

const ProfileList = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 14px 29px 14px;
  row-gap: 45px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
`;

const ProfileListImage = styled(Image)<{ $isSelected: boolean }>`
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;

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
`;

const Span = styled.span`
  color: ${theme.colors.gray300};
  font-size: ${theme.fonts.regular25};
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  color: #44515c;
  font-size: ${theme.fonts.regular25};
  font-weight: 300;
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
  ${(props) => props.theme.fonts.regular18};
  margin: 28px 0;
`;

const MsgConfirm = styled(Msg)`
  ${(props) => props.theme.fonts.regular25};
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
  gap: 10px;
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
