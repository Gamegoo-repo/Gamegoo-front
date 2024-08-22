import { BOTTOM_MODAL } from "@/constants/modal";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

type bottomModalType = "login" | "logout" | "delete";

interface BottomModalProps {
  bottomModalType: bottomModalType;
  onClose: () => void;
}

const BottomModal: React.FC<BottomModalProps> = (props) => {
  const { bottomModalType, onClose } = props;

  const modalData = BOTTOM_MODAL.find(
    (modal) => modal.type === bottomModalType
  );

  if (!modalData) return null;

  return (
    <Background>
      <ModalContainer>
        <Modal>
          <Image
            src={modalData.icon}
            width={modalData.width}
            height={modalData.height}
            alt="icon"
          />
          {modalData.message}
        </Modal>
        <Close onClick={onClose}>{modalData.close}</Close>
      </ModalContainer>
    </Background>
  );
};

export default BottomModal;

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.62);
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
`;

const Modal = styled.div`
  width: 640px;
  height: 149px;
  border-radius: 17px;
  background: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 17px;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.bold20};
`;

const Close = styled.button`
  width: 640px;
  height: 63px;
  border-radius: 17px;
  background: ${theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular20}
`;
