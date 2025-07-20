import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { setCloseAlertModal } from "@/redux/slices/modalSlice";
import { theme } from "@/styles/theme";

import type { RootState } from "@/redux/store";

const Alert = () => {
  const dispatch = useDispatch();
  const showAlert = useSelector((state: RootState) => state.modal.isOpen);
  const alertProps = useSelector((state: RootState) => state.modal.alertProps);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;
  const {
    icon,
    width = 68,
    height = 58,
    content,
    alt,
    onClose,
    buttonText,
  } = alertProps ?? {};

  if (!showAlert) return null;

  return createPortal(
    <Overlay>
      <Wrapper>
        <TextWrapper>
          <Icon
            backgroundUrl={`/assets/icons/${icon}.svg`}
            width={width}
            height={height}
          />
          <Text>{content}</Text>
        </TextWrapper>
        <ButtonWrapper>
          <Button
            onClick={
              onClose
                ? () => {
                    dispatch(setCloseAlertModal());
                    onClose();
                  }
                : () => {
                    dispatch(setCloseAlertModal());
                  }
            }
          >
            {buttonText}
          </Button>
        </ButtonWrapper>
      </Wrapper>
    </Overlay>,
    modalRoot
  );
};

export default Alert;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background: #0000009c;
  inset: 0;
  z-index: ${theme.zIndex.alertConfirm};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Wrapper = styled.div`
  position: absolute;
  bottom: 28px;
  width: 640px;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.mobile}) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    bottom: unset;
  }
`;

const TextWrapper = styled.div`
  background: ${theme.colors.white};
  border-radius: 17px;
  margin-bottom: 10px;
  text-align: center;
  padding: 17px 0 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: ${theme.breakpoints.mobile}) {
    border-radius: 14px;
  }
`;

const Text = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray700};
  margin-top: 18px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium14};
  }
`;

const ButtonWrapper = styled.div`
  background: ${theme.colors.white};
  border-radius: 17px;
  text-align: center;
  padding: 17px 0;
  cursor: pointer;

  @media (max-width: ${theme.breakpoints.mobile}) {
    border-radius: 14px;
  }
`;

const Button = styled.p`
  ${(props) => props.theme.fonts.regular20};
  color: ${theme.colors.gray700};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.semiBold14};
  }
`;
