'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";

interface GraphicBoxProps {
    pathname: string;
    children: string;
    width?: string;
    height: string;
    top: string;
    left: string;
}

const GraphicBox = (props: GraphicBoxProps) => {
    const router = useRouter();
    const {
        pathname,
        children,
        width,
        height,
        top,
        left,
    } = props;

    return (
        <>
            <Wrapper
                onClick={() => router.push(pathname)}
                $width={width}
                $height={height}>
                {/* <Image
                    src='/assets/icons/logo.svg'
                    width={1206}
                    height={227}
                    alt='graphic' /> */}
                <Box>
                    <Title $top={top} $left={left}>{children}</Title>
                </Box>
            </Wrapper>
        </>
    )
}

export default GraphicBox;

const Wrapper = styled.div <{ $width?: string, $height: string }>`
            position: relative;
            max-width:${(props) => props.$width ? props.$width : undefined};
            width:100%;
            height: ${(props) => props.$height};
            background: #D1CAFF;
            border-radius: 30px;
            cursor: pointer;
            `

const Box = styled.div``

const Title = styled.h1<{ $top: string, $left: string }>`
            position: absolute;
            top:${(props) => props.$top};
            left:${(props) => props.$left};
            transform:${(props) => props.$top !== '50%' ? undefined : `translate(-50%, -50%);`};
            color:#393939;
            ${(props) => props.theme.fonts.bold32};
            line-height: 37px;
            `