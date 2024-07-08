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
  return (
    <Container>
      {index}
      <Content>
        <Name>
          <Image
            src={`/assets/images/profile.svg`}
            width={50}
            height={50}
            alt="profile"
          />
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
      <Image
        src={`/assets/icons/three_dots_button.svg`}
        width={3}
        height={15}
        alt="profile"
      />
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
