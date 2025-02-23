import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import styled from "styled-components";

type fontSize = "bold" | "regular";

interface HeaderTitleProps {
  title: string;
  sub?: string;
  mini?: string;
  size?: fontSize;
  blocked?: boolean;
  isDoubleBack?: boolean;
  marginBottom?: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  sub,
  mini,
  size = "bold",
  blocked = false,
  isDoubleBack = false,
  marginBottom,
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (isDoubleBack) {
      window.history.go(-2);
    } else {
      router.back();
    }
  };

  return (
    <Header $marginBottom={marginBottom}>
      <StyledImage
        onClick={handleBackClick}
        src="/assets/icons/arrow_left.svg"
        width={40}
        height={40}
        alt="뒤로가기"
      />
      <Title className={size}>{title}</Title>
      {sub && <Sub>{sub}</Sub>}
      {mini && <Mini>{mini}</Mini>}
      {blocked && <Blocked>차단된 사용자입니다</Blocked>}
    </Header>
  );
};

export default HeaderTitle;

const Header = styled.header<{ $marginBottom?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ $marginBottom }) =>
    $marginBottom ? $marginBottom : "32px"};
`;

const StyledImage = styled(Image)`
  margin-right: 12px;
  cursor: pointer;
`;

const Title = styled.div`
  color: ${theme.colors.gray800};

  &.bold {
    ${(props) => props.theme.fonts.bold32};
  }

  &.regular {
    ${(props) => props.theme.fonts.regular25};
  }
`;

const Sub = styled.div`
  margin-left: 40px;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular28};
`;

const Mini = styled.div`
  margin-left: 12px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular20};
`;

const Blocked = styled.div`
  color: ${theme.colors.red500};
  ${theme.fonts.bold14};
`;
