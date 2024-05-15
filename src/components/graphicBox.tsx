import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

interface GraphicBoxProps {
    href?: string | any;
    children: string;
    width?: string | any;
    height: string;
    top: string;
    left: string,
    onClick?: any
}

const GraphicBox = (props: GraphicBoxProps) => {
    const {
        href,
        children,
        width,
        height,
        top,
        left,
    } = props;

    return (
        <>
            <Link href={href}>
                {/* <Image
                    src='/assets/icons/logo.svg'
                    width={1206}
                    height={227}
                    alt='graphic' /> */}
                <Box $width={width} $height={height}>
                    <Title $top={top} $left={left}>{children}</Title>
                </Box>

            </Link>
        </>
    )
}

export default GraphicBox;

const Box = styled.div<{ $width: string, $height: string }>`
    position: relative;
    width:  ${(props) => props.$width ? props.$width : undefined};
    height: ${(props) => props.$height};
    background: #D1CAFF;
    border-radius: 30px;
    margin-bottom: 30px;
`

const Title = styled.h1<{ $top: string, $left: string }>`
    position: absolute;
    top:${(props) => props.$top};
    left:${(props) => props.$left};
    transform:${(props) => props.$top !== '50%' ? undefined : `translate(-50%, -50%);`}; 
    color:#393939;
   ${(props) => props.theme.fonts.bold32};
   line-height: 37px;
`