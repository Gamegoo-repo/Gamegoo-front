"use client";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled, { css } from "styled-components";

interface GraphicBoxProps {
  type?: string;
  pathname: string;
  children: React.ReactNode;
  width?: string;
  height: string;
  top: string;
  left: string;
  background?: string | undefined;
}

const GraphicBox = (props: GraphicBoxProps) => {
  const router = useRouter();
  const { type, pathname, children, width, height, top, left, background } =
    props;

  const hadleClick = () => {
    router.push(type ? `${pathname}?type=${type}` : pathname);
  };
  return (
    <>
      <Wrapper
        onClick={hadleClick}
        $width={width}
        $height={height}
        $background={background === ""}
      >
        {background && (
          <BackgroundImage
            src={background}
            width={580}
            height={285}
            alt="graphic"
          />
        )}
        <Box>
          <Title $top={top} $left={left}>
            {children}
          </Title>
        </Box>
      </Wrapper>
    </>
  );
};

export default GraphicBox;

const Wrapper = styled.div<{
  $width?: string;
  $height: string;
  $background: boolean;
}>`
  position: relative;
  max-width: ${(props) => (props.$width ? props.$width : undefined)};
  width: 100%;
  height: ${(props) => props.$height};
  border-radius: 30px;
  cursor: pointer;

  ${({ $background }) =>
    $background &&
    css`
      background: ${theme.colors.gray600};
      &:hover {
        box-shadow: 0px 0px 38.3px 0px rgba(90, 66, 238, 0.7);
      }
    `}
`;

const BackgroundImage = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 580px;
    height: 285px;
  }
`;

const Box = styled.div``;

const Title = styled.div<{ $top: string; $left: string }>`
  position: absolute;
  top: ${(props) => props.$top};
  left: ${(props) => props.$left};
  transform: ${(props) =>
    props.$top !== "50%" ? undefined : `translate(-50%, -50%);`};
  color: white;
  ${(props) => props.theme.fonts.bold32};
  line-height: 37px;
  white-space: nowrap;
`;
