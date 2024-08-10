import styled from "styled-components";
import { theme } from "@/styles/theme";


const Alert = () => {
    return (
        <Overlay>
            <Wrapper>

            </Wrapper>
        </Overlay>
    )
};

export default Alert;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background:#0000009C;
  inset: 0;
  z-index: 100;
`;

const Wrapper = styled.div`
  width: 640px;
  background: ${theme.colors.white};
  border-radius:17px;
  overflow: hidden;
`;