import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { Mike } from "@/types/user/mike";

interface MicProps {
  status: Mike;
}

const Mic = (props: MicProps) => {
  const { status } = props;

  return (
    <Wrapper>
      <Image
        src={`/assets/icons/mic_${
          status === "AVAILABLE" ? "on" : "off"
        }_no_bg.svg`}
        width={27}
        height={33}
        alt={`mic ${status === "AVAILABLE" ? "on" : "off"}`}
      />
      <MicText className={status === "AVAILABLE" ? "on" : "off"}>
        마이크 {status === "AVAILABLE" ? "ON" : "OFF"}
      </MicText>
    </Wrapper>
  );
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
    color: ${theme.colors.violet600};
  }
  &.off {
    color: #606060;
  }
`;
