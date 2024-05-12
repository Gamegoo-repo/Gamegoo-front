import { theme } from "@/styles/theme";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

interface GraphicBoxProps {
    href: string;
    children: string;
}

const GraphicBox = (props: GraphicBoxProps) => {
    const { href, children } = props;

    return (
        <>
            <Link href={href}>
                {/* <Image
                    src='/assets/icons/logo.svg'
                    width={1206}
                    height={227}
                    alt='graphic' /> */}
                <Box>
                    <Title>{children}</Title>
                </Box>

            </Link>
        </>
    )
}

export default GraphicBox;

const Box = styled.div`
    position: relative;
    width: 1206px;
    height: 227px;
    background: #D1CAFF;
    border-radius: 30px;
    margin-bottom: 30px;
`

const Title = styled.h1`
    position: absolute;
    top:36px;
    left:41px;
    color:#393939;
  ${(props) => props.theme.fonts.bold32};
  line-height: 37px;
`