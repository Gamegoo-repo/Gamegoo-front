import styled from "styled-components";

const Banner = () => {
  return (
    <BannerWrapper>
      <TextContainer>
        <p>
          <HighlightText>겜구 커뮤니티에 오신 것을 환영해요 🎉</HighlightText>
        </p>
        <Description>게임 친구를 쉽고 빠르게 구해줄게요!</Description>
      </TextContainer>
      <Logo>GAMGOO</Logo>
    </BannerWrapper>
  );
};

export default Banner;

const BannerWrapper = styled.div`
  width: 100%;
  height: 128px;
  background: #f0f0fc;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 40px;
  position: relative;
  margin-bottom: 32px;
`;

const TextContainer = styled.div`
  flex: 1;
`;

const HighlightText = styled.span`
  color: #8a63d2;
  font-weight: bold;
`;

const Description = styled.p`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const Logo = styled.div`
  font-size: 72px;
  font-weight: bold;
  font-family: "TimeForSalad", sans-serif;
  color: #c1b7ff;
  opacity: 0.3;
  position: absolute;
  right: 20px;
  letter-spacing: 5px;
`;
