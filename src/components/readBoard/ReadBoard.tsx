import styled from "styled-components";
import { theme } from "@/styles/theme";
import CRModal from "../crBoard/CRModal";
import Button from "../common/Button";
import PositionBox from "../crBoard/PositionBox";
import { useState } from "react";
import ProfileImage from "./ProfileImage";
import User from "../crBoard/User";
import MannerLevel from "../common/MannerLevel";
import Mic from "./Mic";
import Report from "./Report";
import Champion from "./Champion";
import QueueType from "./QueueType";
import WinningRate from "./WinningRate";
import MannerLevelBox from "../common/MannerLevelBox";

interface ReadBoardProps {
  onClose: () => void;
  postId: number | null;
}

interface userInfo {
  image: string;
  account: string;
  tag: string;
  tier: string;
  manner_level: number;
  mic: number;
}

const userData = {
  image: "/assets/icons/profile_img.svg",
  account: "유니콘의 비밀",
  tag: "KR1",
  tier: "B3",
  manner_level: 5,
  mic: 1,
  champions: [
    { id: 1, value: "/assets/icons/gray_circle.svg" },
    { id: 2, value: "/assets/icons/gray_circle.svg" },
    { id: 3, value: "/assets/icons/gray_circle.svg" },
  ],
  queue: "솔로1",
  winning_rate: {
    completed: 76,
    history: 20,
  },
};

const ReadBoard = (props: ReadBoardProps) => {
  const { onClose, postId } = props;

  const [textareaValue, setTextareaValue] = useState("");

  const [isReportBoxOpen, setIsReportBoxOpen] = useState(false);
  const [isMannerLevelBoxOpen, setIsMannerLevelBoxOpen] = useState(false);

  const handleReportBoxOpen = () => {
    setIsReportBoxOpen((prevState) => !prevState);
  };

  const handleReport = () => {
    // 신고하기 api
    setIsReportBoxOpen(false);
  };

  const handleMannerLevelBoxOpen = () => {
    setIsMannerLevelBoxOpen((prevState) => !prevState);
  };

  // const [user, setUser] = useState<userInfo>()

  // TODO: api 연결
  // useEffect(() => {
  //     axios.get('http://localhost:3001/user')
  //         .then(response => {
  //             setUser(response.data)
  //         })
  //         .catch(error => {
  //             console.error('Error fetching data:', error);
  //         });
  // }, [])

  return (
    <CRModal type="reading" onClose={onClose}>
      {isReportBoxOpen && (
        <ReportBox>
          <ReportText onClick={handleReport}>신고하기</ReportText>
        </ReportBox>
      )}
      {isMannerLevelBoxOpen && <MannerLevelBox top="14%" right="-6%" />}
      <UpdatedDate>게시일 : 24.05.06. 12:45</UpdatedDate>
      <UserSection>
        <UserLeft>
          <ProfileImage
            image={userData.image} />
          <UserNManner>
            <User
              account={userData.account}
              tag={userData.tag}
              tier={userData.tier} />
            <MannerLevel
              level={userData.manner_level}
              onClick={handleMannerLevelBoxOpen} />
          </UserNManner>
        </UserLeft>
        <UserRight>
          <Mic
            status={userData.mic} />
          <Report
            onClick={handleReportBoxOpen} />
        </UserRight>
      </UserSection>
      <ChampionNQueueSection>
        <Champion
          list={userData.champions} />
        <QueueType
          value={userData.queue} />
      </ChampionNQueueSection>
      <PositionSection>
        <Title>포지션</Title>
        <PositionBox status="reading" />
      </PositionSection>
      <WinningRateSection>
        <WinningRate
          completed={userData.winning_rate.completed}
          history={userData.winning_rate.history} />
      </WinningRateSection>
      <StyleSection>
        <Title>게임 스타일</Title>
      </StyleSection>
      <MemoSection>
        <Title>메모</Title>
        <Memo>
          <MemoData>
            가볍게 같이 즐기실 분 구해요 !
          </MemoData>
        </Memo>
      </MemoSection>
      <ButtonContent>
        <Button
          type="submit"
          buttonType="primary"
          text="말 걸어보기"
          onClick={onClose} />
      </ButtonContent>
    </CRModal>
  );
};

export default ReadBoard;

const UpdatedDate = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray200};
  margin:1px 0 12px;
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    gap:90px;
`;

const UserLeft = styled.div`
    display:flex;
    align-items: center;
`;
const UserNManner = styled.div`
    display:flex;
`;
const UserRight = styled.div`
    display:flex;
`;
const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color: #222222;
    margin-bottom:5px;
`;

const ChampionNQueueSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap:89px;
    margin-top:33px;    
`;

const PositionSection = styled.div`
    margin-top:33px;    
`;

const WinningRateSection = styled.div`
    margin-top:33px;    
`;

const StyleSection = styled.div`
    margin-top:33px;    
`;

const MemoSection = styled.div`
    margin-top:33px;    
`;

const Memo = styled.div`
    width: 100%;
    min-height: 77px;
    padding: 11px 20px;
    border-radius: 15px;
    border: 1px solid ${theme.colors.purple300};  
`;

const MemoData = styled.p`
    color: #606060;
    ${(props) => props.theme.fonts.regular18}
`;

const ButtonContent = styled.p`
    margin:30px 0 28px;    
    text-align: center;
`;

const ReportBox = styled.div`
    position: absolute;
    top: 8.5%;
    right: -31%;
    z-index: 100;
    box-shadow: 0 0 21.3px 0 #00000026;
    background: ${theme.colors.white}; 
    padding:10px 103px 10px 20px;
    border-radius: 10px;
`;

const ReportText = styled.p`
    ${(props) => props.theme.fonts.medium15};
    color: #606060;
    cursor: pointer;
`;
