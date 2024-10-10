import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import styled from "styled-components";

type fontSize = "bold" | "regular";

interface HeaderTitleProps {
  title: string;
  sub?: string;
  size?: fontSize;
  blocked?: boolean;
  isDoubleBack?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  sub,
  size = "bold",
  blocked = false,
  isDoubleBack = false,
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
    <Header>
      <StyledImage
        onClick={handleBackClick}
        src="/assets/icons/left_arrow.svg"
        width={20}
        height={39}
        alt="back button"
      />
      <Title className={size}>{title}</Title>
      {sub && <Sub>{sub}</Sub>}
      {blocked && <Blocked>차단된 사용자입니다</Blocked>}
    </Header>
  );
};

export default HeaderTitle;

const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
`;

const StyledImage = styled(Image)`
  margin-right: 35px;
  cursor: pointer;
`;

const Title = styled.div`
  color: ${theme.colors.gray100};
  margin-right: 40px;

  &.bold {
    ${(props) => props.theme.fonts.bold32};
  }

  &.regular {
    ${(props) => props.theme.fonts.regular25};
  }
`;

const Sub = styled.div`
  ${(props) => props.theme.fonts.regular28};
  color: ${theme.colors.gray600};
`;

const Blocked = styled.div`
  color: ${theme.colors.error200};
  ${theme.fonts.bold14};
`;
