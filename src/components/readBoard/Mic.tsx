import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";

interface MicProps {
    status: number;
}

const Mic = (props: MicProps) => {
    const { status } = props;

    return (
        <Wrapper>
            <Image
                src={status === 0 ?
                    "/assets/icons/mic_on_no_bg.svg"
                    :
                    "/assets/icons/mic_off_no_bg.svg"}
                width={27}
                height={33}
                alt={`mic ${status === 0 ? "on" : "off"}`} />
            <MicText className={status === 0 ? 'on' : 'off'}>마이크 {status === 0 ? "ON" : "OFF"}</MicText>
        </Wrapper>
    )
};

export default Mic;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const MicText = styled.p`
    ${(props) => props.theme.fonts.bold10};
    margin-top: 6px;
    &.on {
        color:${theme.colors.purple100};
    }
    &.off {
        color:#606060;
    }
`;

