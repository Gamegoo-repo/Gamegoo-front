import { FC } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import ConfirmModal from "../ConfirmModal";

interface PostItemModalProps {
  // 차단 관련
  isBlockBoxOpen: boolean;
  isBlockConfirmOpen: boolean;
  isBlockedStatus: boolean;
  onBlockConfirm: () => void;
  onBlockCancel: () => void;
  onBlockCompleteClose: () => void;

  // 끌어올리기 관련
  isPullUpConfirmOpen: boolean;
  onPullUpConfirm: () => void;
  onPullUpCancel: () => void;
}

const PostItemModal: FC<PostItemModalProps> = ({
  isBlockBoxOpen,
  isBlockConfirmOpen,
  isBlockedStatus,
  onBlockConfirm,
  onBlockCancel,
  onBlockCompleteClose,
  isPullUpConfirmOpen,
  onPullUpConfirm,
  onPullUpCancel,
}) => {
  // 차단 확인 팝업
  if (isBlockBoxOpen) {
    return (
      <ConfirmModal
        width="540px"
        primaryButtonText="예"
        secondaryButtonText="아니요"
        onPrimaryClick={onBlockConfirm}
        onSecondaryClick={onBlockCancel}
      >
        {isBlockedStatus ? (
          <MsgConfirm>{"차단을 해제 하시겠습니까?"}</MsgConfirm>
        ) : (
          <Msg>
            {
              "차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다.\n\n차단하시겠습니까?"
            }
          </Msg>
        )}
      </ConfirmModal>
    );
  }

  // 차단 완료 팝업
  if (isBlockConfirmOpen) {
    return (
      <ConfirmModal
        width="540px"
        primaryButtonText="확인"
        onPrimaryClick={onBlockCompleteClose}
      >
        <MsgConfirm>{`${
          isBlockedStatus ? "차단이" : "차단 해제가"
        } 완료되었습니다.`}</MsgConfirm>
      </ConfirmModal>
    );
  }

  // 끌어올리기 확인 팝업
  if (isPullUpConfirmOpen) {
    return (
      <ConfirmModal
        width="540px"
        primaryButtonText="아니요"
        secondaryButtonText="예"
        onPrimaryClick={onPullUpCancel}
        onSecondaryClick={onPullUpConfirm}
      >
        <MsgConfirm>{`본 게시글을 끌어올리시겠습니까?`}</MsgConfirm>
      </ConfirmModal>
    );
  }

  return null;
};

export default PostItemModal;

const Msg = styled.div`
  text-align: center;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular25};
  margin: 28px 0;
`;

const MsgConfirm = styled(Msg)`
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;
  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.medium14};
    margin: 32px 0;
  }
`;
