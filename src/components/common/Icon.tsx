import styled from "styled-components";

import { theme } from "@/styles/theme";

interface IconProps {
  backgroundUrl: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Icon = (props: IconProps) => {
  const { backgroundUrl, width, height, onClick, style } = props;

  return (
    <StyledIcon
      $backgroundUrl={backgroundUrl}
      $width={width}
      $height={height}
      onClick={onClick}
      style={style}
    />
  );
};

export default Icon;

const StyledIcon = styled.div<{
  $backgroundUrl: string;
  $width: number;
  $height: number;
}>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  background: ${(props) => `url(${props.$backgroundUrl})`};
  ${theme.icon.backgroundSetting}
`;
