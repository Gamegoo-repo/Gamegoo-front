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
    <Wrapper className={status === "AVAILABLE" ? "on" : "off"}>
      <Image
        src={`/assets/icons/mic_${
          status === "AVAILABLE" ? "on" : "off"
        }_no_bg.svg`}
        width={12}
        height={12}
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
  align-items: center;
  gap: 2px;
  padding: 1px 6px;
  border-radius: 999px;
  &.on {
    border: 1px solid ${theme.colors.violet600};
  }
  &.off {
    border: 1px solid ${theme.colors.gray600};
  }
`;

const MicText = styled.p`
  ${(props) => props.theme.fonts.bold9};
  &.on {
    color: ${theme.colors.violet600};
  }
  &.off {
    color: ${theme.colors.gray600};
  }
`;
