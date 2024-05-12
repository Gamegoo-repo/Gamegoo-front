import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

interface GraphicBoxProps {
    href: string;
    children: string;
    width: string;
    top: string;
    left: string
}

const GraphicBox = (props: GraphicBoxProps) => {
    const {
        href,
        children,
        width,
        top,
        left
    } = props;
    return (
        <>
            <Link href={href}>
                {/* <Image
                    src='/assets/icons/logo.svg'
                    width={1206}
                    height={227}
                    alt='graphic' /> */}
                <Box width={width}>
                    <Title top={top} left={left}>{children}</Title>
                </Box>

            </Link>
        </>
    )
}

export default GraphicBox;

const Box = styled.div<{ width: string }>`
    position: relative;
    width:  ${(props) => props.width};
    height: 227px;
    background: #D1CAFF;
    border-radius: 30px;
    margin-bottom: 30px;
`

const Title = styled.h1<{ top: string, left: string }>`
    position: absolute;
    top:${(props) => props.top};
    left:${(props) => props.left};
    transform:${(props) => props.top !== '50%' ? undefined : `translate(-50%, -50%);`}; 
    color:#393939;
  ${(props) => props.theme.fonts.bold32};
  line-height: 37px;
`