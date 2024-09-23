import { blockMember, deleteBlockMember, unblockMember } from "@/api/member";
import ConfirmModal from "@/components/common/ConfirmModal";
import MoreBox from "@/components/common/MoreBox";
import { theme } from "@/styles/theme";
import { getProfileBgColor } from "@/utils/profile";
import Image from "next/image";
import React, { useState } from "react";
import MoreBoxButton from "../../readBoard/MoreBoxButton";
import styled, { css } from "styled-components";
import { useRouter } from "next/navigation";

export interface BlockedBoxProps {
  memberId: number;
  profileImg: number;
  email: string;
  name: string;
  isBlind: boolean;
}

const BlockedBox: React.FC<BlockedBoxProps> = ({
  memberId,
  profileImg,
  email,
  name,
  isBlind,
}) => {
  const router = useRouter();
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState<boolean>(false);
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState<boolean>(false);
  const [isBlockConfirmOpen, setIsBlockConfrimOpen] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(true);

  const handleBlock = () => {
    setIsBlockBoxOpen(true);
  };

  const handleRunBlock = async () => {
    setIsBlockBoxOpen(false);
    if (isBlocked) {
      // 차단해제 api
      await unblockMember(memberId);
      setIsBlocked(false);
    } else {
      // 차단 api
      await blockMember(memberId);
      setIsBlocked(true);
    }
    setIsBlockConfrimOpen(true);
  };

  const handleDelete = () => {
    setIsBlockBoxOpen(true);
  };

  const handleRunDelete = async () => {
    setIsBlockBoxOpen(false);
    // 탈퇴 회원 차단목록 삭제 api
    await deleteBlockMember(memberId);
  };

  const handleShowProfile = () => {
    if (!isBlind) {
      router.push(`/user/${memberId}`);
    }
  };
  return (
    <Container onClick={handleShowProfile} $isBlind={isBlind}>
      <Gap $isBlind={isBlind}>
        <ProfileImgWrapper $bgColor={getProfileBgColor(profileImg)}>
          <ProfileImg
            src={`/assets/images/profile/profile${profileImg}.svg`}
            width={40}
            height={40}
            alt="profile"
          />
        </ProfileImgWrapper>
        {name}
      </Gap>
      <MoreDiv>
        <MoreBoxButton
          onClick={() => {
            setIsMoreBoxOpen(!isMoreBoxOpen);
          }}
        />
        {isMoreBoxOpen && (
          <MoreBox
            items={[
              {
                text: `${isBlind ? "삭제" : isBlocked ? "차단 해제" : "차단"}`,
                onClick: () => {
                  if (isBlind) {
                    handleDelete();
                  } else {
                    handleBlock();
                  }
                },
              },
            ]}
            top={15}
            left={45}
          />
        )}
      </MoreDiv>
      {/* 차단하기 팝업 */}
      {isBlockBoxOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="예"
          secondaryButtonText="아니요"
          onPrimaryClick={() => {
            if (isBlind) {
              handleRunDelete();
            } else {
              handleRunBlock();
            }
          }}
          onSecondaryClick={() => {
            setIsBlockBoxOpen(false);
          }}
        >
          {isBlind ? (
            <MsgConfirm>
              {"본 탈퇴 회원을 차단목록에서 삭제하시겠습니까?"}
            </MsgConfirm>
          ) : isBlocked ? (
            <MsgConfirm>{"차단을 해제 하시겠습니까?"}</MsgConfirm>
          ) : (
            <Msg>
              {
                "차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다.\n\n차단하시겠습니까?"
              }
            </Msg>
          )}
        </ConfirmModal>
      )}
      {/* 차단하기 확인 팝업 */}
      {isBlockConfirmOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="확인"
          onPrimaryClick={() => {
            setIsBlockConfrimOpen(false);
            window.location.reload();
          }}
        >
          <MsgConfirm>{`${
            isBlocked ? "차단이" : "차단 해제가"
          } 완료되었습니다.`}</MsgConfirm>
        </ConfirmModal>
      )}
    </Container>
  );
};

export default BlockedBox;

const Container = styled.div<{ $isBlind: boolean }>`
  width: 100%;
  height: 90px;
  padding: 17px 13px 17px 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.gray600};
  border-bottom: 1px solid ${theme.colors.gray300};
  ${(props) => props.theme.fonts.semiBold18}

  ${({ $isBlind }) =>
    $isBlind &&
    css`
      background: #f0f0f01c;
    `}
`;

const Gap = styled.div<{ $isBlind: boolean }>`
  display: flex;
  align-items: center;
  gap: 21px;

  ${({ $isBlind }) =>
    $isBlind &&
    css`
      opacity: 0.7;
    `}
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 54px;
  height: 54px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const ProfileImg = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MoreDiv = styled.div`
  position: relative;
`;

const Msg = styled.div`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular20};
  margin: 28px 0;
`;

const MsgConfirm = styled(Msg)`
  ${(props) => props.theme.fonts.regular20};
  margin: 80px 0;
`;
