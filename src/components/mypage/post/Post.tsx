import MoreBox from "@/components/common/MoreBox";
import Report from "@/components/readBoard/Report";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";

interface PostProps {
  index: number;
  profileImg: string;
  nickname: string;
  tag: string;
  tier: string;
  text: string;
  time: string;
}

const Post: React.FC<PostProps> = ({
  index,
  profileImg,
  nickname,
  tag,
  tier,
  text,
  time,
}) => {
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);

  const handleMoreBoxOpen = () => {
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  const handleModify = () => {
    // 수정하기 api
    setIsMoreBoxOpen(false);
  };

  const handleDelete = () => {
    // 삭제하기 api
    setIsMoreBoxOpen(false);
  };

  return (
    <Container>
      {index}
      <Content>
        <Name>
          <ProfileImage>
            <PersonImage
              src={`/assets/images/profile/${profileImg}.svg`}
              width={40}
              height={40}
              alt="프로필"
            />
          </ProfileImage>
          <Div>
            {nickname}
            <Tag>#{tag}</Tag>
          </Div>
        </Name>
        <Tier>
          <Image
            src={`/assets/images/rank_${tier}.svg`}
            width={26}
            height={26}
            alt="profile"
          />
          {tier}
        </Tier>
        <Memo>{text}</Memo>
        <Date>
          {time} <Minute>20분 전</Minute>
        </Date>
      </Content>
      <More>
        <Report onClick={handleMoreBoxOpen} />
        {isMoreBoxOpen && (
          <MoreBox
            text1="수정"
            text2="삭제"
            handleFirst={handleModify}
            handleSecond={handleDelete}
          />
        )}
      </More>
    </Container>
  );
};

export default Post;

const Container = styled.div`
  width: 100%;
  height: 95px;
  padding: 23px 15px 23px 7px;
  display: flex;
  align-items: center;
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray300};
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.bold16};
  gap: 26px;
`;

const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr;
  align-items: center;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  ${(props) => props.theme.fonts.medium16};
  white-space: nowrap;
`;

const ProfileImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 93px;
  background: ${theme.colors.purple300};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PersonImage = styled(Image)`
  filter: drop-shadow(-4px 10px 10px rgba(63, 53, 78, 0.582));
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const Tag = styled.div`
  color: ${theme.colors.gray300};
`;

const Tier = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.fonts.regular14};
`;

const Memo = styled.div`
  display: flex;
  justify-content: center;
  ${(props) => props.theme.fonts.regular14};
`;

const Date = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.medium11};
`;

const Minute = styled.div`
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.semiBold14};
`;

const More = styled.div`
  position: relative;
`;
