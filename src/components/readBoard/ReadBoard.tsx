import styled from "styled-components";
import { theme } from "@/styles/theme";
import CRModal from "../crBoard/CRModal";
import Button from "../common/Button";
import PositionBox from "../crBoard/PositionBox";
import { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import User from "../crBoard/User";
import MannerLevel from "../common/MannerLevel";
import Mic from "./Mic";
import MoreBoxButton from "./MoreBoxButton";
import Champion from "./Champion";
import QueueType from "./QueueType";
import WinningRate from "./WinningRate";
import MannerLevelBox from "../common/MannerLevelBox";
import GameStyle from "./GameStyle";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import MoreBox from "../common/MoreBox";
import Image from "next/image";
import { Post } from "@/interface/board";
import { getPost } from "@/api/board";
import LoadingSpinner from "../common/LoadingSpinner";
import { setPostingDateFormatter } from "@/utils/custom";

interface ReadBoardProps {
  onClose: () => void;
  postId: number;
  gameType: 'canyon' | 'wind';
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
  const { onClose, postId, gameType } = props;

  const [post, setPost] = useState<Post>();
  const [textareaValue, setTextareaValue] = useState("");
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isMannerBalloonVisible, setIsMannerBalloonVisible] = useState(true);
  const [isMannerLevelBoxOpen, setIsMannerLevelBoxOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 클릭해서 매너지워드 보기 박스 닫히 */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMannerBalloonVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  /* 더보기 버튼 토글 */
  const handleMoreBoxToggle = () => {
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  /* 더보기 버튼 닫기 */
  const handleMoreBoxClose = () => {
    setIsMoreBoxOpen(false);
  };

  /* 신고하기 */
  const handleReport = () => {
    console.log('신고하기');
    handleMoreBoxClose();
  };

  /* 차단하기 */
  const handleBlock = () => {
    console.log('차단하기')
    handleMoreBoxClose();
  };

  /* 친구 추가 */
  const handleAddFriend = () => {
    console.log('친구추가')
    handleMoreBoxClose();
  };

  /* 매너레벨 박스 열기 */
  const handleMannerLevelBoxOpen = () => {
    setIsMannerLevelBoxOpen((prevState) => !prevState);
  };

  /* 더보기 버튼 메뉴 */
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [
    { text: '친구 추가', onClick: handleAddFriend },
    { text: '차단하기', onClick: handleBlock },
    { text: '신고하기', onClick: handleReport },
  ];

  /* 게시글 api */
  useEffect(() => {
    const getPostData = async () => {
      setLoading(true);
      const data = await getPost(postId);
      setPost(data.result);
      setLoading(false);
    };

    getPostData();
  }, [])

  // 스피너 진주님과 합치기
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <CRModal type="reading" onClose={onClose}>
      {post && (
        <>
          {isMoreBoxOpen && (
            <MoreBox
              items={MoreBoxMenuItems}
              top={67}
              left={828} />
          )}
          {isMannerLevelBoxOpen && <MannerLevelBox top="14%" right="22%" />}
          <UpdatedDate>게시일 : {setPostingDateFormatter(post.createdAt)}</UpdatedDate>
          <UserSection>
            <UserLeft>
              <ProfileImage
                image={post.profileImage} />
              <UserNManner>
                <User
                  account={post.gameName}
                  tag={post.tag}
                  tier={post.tier} />
                <MannerLevel
                  level={post.mannerLevel}
                  onClick={handleMannerLevelBoxOpen}
                  position="top"
                  isBalloon={isMannerBalloonVisible} />
              </UserNManner>
            </UserLeft>
            <UserRight>
              <Mic
                status={post.voice} />
              <MoreBoxButton onClick={handleMoreBoxToggle} />
            </UserRight>
          </UserSection>
          <ChampionNQueueSection>
            <Champion
              list={post.championList}
              size={14} />
            <QueueType
              value={post.gameMode} />
          </ChampionNQueueSection>
          {post.mainPosition &&
            post.subPosition &&
            post.wantPosition &&
            <PositionSection>
              <Title>포지션</Title>
              <PositionBox
                status="reading"
                main={post.mainPosition}
                sub={post.subPosition}
                want={post.wantPosition} />
            </PositionSection>
          }
          <WinningRateSection $gameType={gameType}>
            <WinningRate
              completed={userData.winning_rate.completed}
              history={userData.winning_rate.history} />
          </WinningRateSection>
          <StyleSection $gameType={gameType}>
            <Title>게임 스타일</Title>
            <GameStyle styles={post.gameStyles} />
          </StyleSection>
          <MemoSection $gameType={gameType}>
            <Title>메모</Title>
            <Memo>
              <MemoData>
                {post.contents}
              </MemoData>
            </Memo>
          </MemoSection>
          <ButtonContent $gameType={gameType}>
            <Button
              type="submit"
              buttonType="primary"
              text="말 걸어보기"
              onClick={onClose} />
          </ButtonContent>
        </>
      )}
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

const WinningRateSection = styled.div<{ $gameType: string }>`
    margin-top:${({ $gameType }) => ($gameType === "canyon" ? "33px" : "46px")};  
`;

const StyleSection = styled.div<{ $gameType: string }>`
    margin-top:${({ $gameType }) => ($gameType === "canyon" ? "33px" : "46px")};  
`;

const MemoSection = styled.div<{ $gameType: string }>`
    margin-top:${({ $gameType }) => ($gameType === "canyon" ? "33px" : "46px")};   
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

const ButtonContent = styled.p<{ $gameType: string }>`
    margin:${({ $gameType }) => ($gameType === "canyon" ? "30px" : "150px")} 0 28px;    
    text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; // 페이지 전체 높이
`;
