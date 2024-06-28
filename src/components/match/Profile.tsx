import React, { useEffect, useState } from "react";
import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";
import GameStyle from "./GameStyle";
import { POSITIONS } from "@/data/profile";
import Champion from "../readBoard/Champion";
import Toggle from "../common/Toggle";
import Button from "../common/Button";
import Report from "../readBoard/Report";
import FormModal from "../common/FormModal";
import Checkbox from "../common/Checkbox";
import { REPORT_REASON } from "@/data/report";
import Input from "../common/Input";
import ConfirmModal from "../common/ConfirmModal";

type profileType = "fun" | "hard" | "other" | "me";

interface Champion {
  id: number;
  value: string;
}

interface User {
  image: string;
  account: string;
  tag: string;
  tier: string;
  mic: boolean;
  champions?: Champion[];
  gameStyle: string[];
}

interface Profile {
  user: User;
  profileType: profileType;
}

const Profile: React.FC<Profile> = ({ profileType, user }) => {
  const [isMike, setIsMike] = useState(user.mic);
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isReportBoxOpen, setIsReportBoxOpen] = useState(false);
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfrimOpen] = useState(false);
  const [reportDetail, setReportDetail] = useState<string>("");

  useEffect(() => {
    setIsMike(user.mic);
  }, [user.mic]);

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

  return (
    <Container className={profileType}>
      <Row>
        <ImageContainer>
          <Image src={user.image} width={186} height={186} alt="프로필" />
          {profileType !== "other" && (
            <CameraImage
              src="/assets/icons/profile_camera.svg"
              width={54}
              height={54}
              alt="프로필 이미지"
            />
          )}
        </ImageContainer>
        <StyledBox>
          <TopContainer>
            <Top>
              {user.account}
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
                <Report onClick={handleMoreBoxOpen} />
                {isMoreBoxOpen && (
                  <ReportBox>
                    <ReportText onClick={handleReport}>신고하기</ReportText>
                    <Bar />
                    <ReportText onClick={handleBlock}>차단하기</ReportText>
                  </ReportBox>
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
                    buttonText="신고하기"
                    onClose={handleReport}
                    disabled
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
                    </div>
                  </FormModal>
                )}
                {/* 차단하기 팝업 */}
                {isBlockBoxOpen && (
                  <ConfirmModal
                    type="yesOrNo"
                    width="540px"
                    borderRadius="20px"
                    onCheck={() => {
                      setIsBlockBoxOpen(false);
                      setIsBlockConfrimOpen(true);
                    }}
                    onClose={() => {
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
                    type="confirm"
                    width="540px"
                    borderRadius="20px"
                    onClose={() => {
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
              gameStyle={user.gameStyle}
              mic={user.mic}
            />
          ) : (
            <UnderRow>
              <Position>
                {(profileType === "other"
                  ? POSITIONS.slice(0, 2)
                  : POSITIONS
                ).map((position, index) => (
                  <Posi key={index} className={profileType}>
                    {position.label}
                    <Image
                      src={`/assets/icons/position_${position.position}_purple.svg`}
                      width={55}
                      height={40}
                      alt="포지션"
                    />
                  </Posi>
                ))}
              </Position>
              {user.champions && <Champion size={14} list={user.champions} />}
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
          gameStyle={user.gameStyle}
          mic={user.mic}
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

const CameraImage = styled(Image)`
  position: absolute;
  bottom: 0px;
  left: 0px;
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
  position: relative;
`;

const Admit = styled.div``;

const ReportBox = styled.div`
  width: 175px;
  height: 84px;
  position: absolute;
  top: 60px;
  left: 300px;
  transform: translateY(-50%);
  z-index: 100;
  box-shadow: 0 0 21.3px 0 #00000026;
  background: ${theme.colors.white};
  border-radius: 10px;
`;

const ReportText = styled.p`
  padding: 10px 20px;
  ${(props) => props.theme.fonts.medium15};
  color: #606060;
  white-space: nowrap;
  cursor: pointer;
`;

const Bar = styled.div`
  width: 100%;
  height: 1px;
  background: ${theme.colors.gray400};
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
