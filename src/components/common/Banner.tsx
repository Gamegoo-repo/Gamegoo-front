import { theme } from "@/styles/theme";
import styled from "styled-components";
import useMediaQueries from "@/hooks/useMediaQueries";

const Banner = () => {
  const isMobile = useMediaQueries({ breakpoint: 700 });

  return (
    <BannerWrapper>
      <TextContainer>
        <p>
          <HighlightText>겜구 커뮤니티에 오신 것을 환영해요 🎉</HighlightText>
        </p>
        <Description>게임 친구를 쉽고 빠르게 구해줄게요!</Description>
      </TextContainer>
      {!isMobile && <Logo>GAMGOO</Logo>}
    </BannerWrapper>
  );
};

export default Banner;

const BannerWrapper = styled.div`
  width: 100%;
  height: 128px;
  background: ${theme.colors.violet100};
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 40px;
  position: relative;
  margin-bottom: 32px;
  @media (max-width: 700px) {
    height: unset;
    padding: 20px;
    border-radius: 8px;
  }
`;

const TextContainer = styled.div`
  flex: 1;
`;

const HighlightText = styled.span`
  color: ${theme.colors.violet600};
  ${theme.fonts.bold16}
  @media (max-width: 700px) {
    ${theme.fonts.bold13}
  }
`;

const Description = styled.p`
  margin-top: 4px;
  ${theme.fonts.regular20}
  color: ${theme.colors.gray800};
  @media (max-width: 700px) {
    ${theme.fonts.regular14}
  }
`;

const Logo = styled.div`
  font-size: 72px;
  font-weight: bold;
  font-family: var(--font-timeforsalad), sans-serif;
  color: ${theme.colors.violet300};
  opacity: 0.3;
  position: absolute;
  right: 40px;
  letter-spacing: 5px;
`;
