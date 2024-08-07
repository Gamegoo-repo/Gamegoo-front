"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import MyPageProfile from "@/components/mypage/profile/MyPageProfile";
import PasswordModal from "@/components/mypage/profile/PasswordModal";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { getProfile } from "@/api/mypage";
import { setUserProfile } from "@/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setChatRoomDateFormatter } from "@/utils/custom";

const passwordLength = 10;

const MyProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const circles = Array.from({ length: passwordLength });

  const [isPasswordModify, setIsPasswordModify] = useState<boolean>(false);

  /* 회원탈퇴 모달 */
  const [isWithdrawalCaution, setIsWithdrawalCaution] =
    useState<boolean>(false);
  const [isWithdrawalComplete, setIsWithdrawalComplete] =
    useState<boolean>(false);

  const handleWithdrawal = () => {
    // 회원탈퇴 API 연동
    setIsWithdrawalCaution(false);
    setIsWithdrawalComplete(true);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        dispatch(setUserProfile(response.result));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  /* user 업데이트 값 가져오기 */
  useEffect(() => {
    // 필요한 로직을 여기에 추가
    console.log("user 업데이트:", user);
  }, [user]);

  return (
    <Wrapper>
      <MyProfileContent>
        <Profile>
          <Title>내 프로필</Title>
          <MyPageProfile user={user} />
        </Profile>
        <Private>
          <Title>
            개인정보
            <Small>{`마지막 업데이트 : ${setChatRoomDateFormatter(
              user.updatedAt
            )}`}</Small>
          </Title>
          <PrivateContent>
            <Box>
              <Label>이메일</Label>
              <Email>{user.email}</Email>
            </Box>
            <Box>
              <Label>비밀번호</Label>
              <Row>
                <Password>
                  {circles.map((_, index) => (
                    <Circle key={index} />
                  ))}
                </Password>
                <Modify onClick={() => setIsPasswordModify(true)}>수정</Modify>
              </Row>
            </Box>
            {isPasswordModify && (
              <PasswordModal onClose={() => setIsPasswordModify(false)} />
            )}
          </PrivateContent>
        </Private>
        <P onClick={() => setIsWithdrawalCaution(true)}>회원탈퇴</P>
        {/* 회원탈퇴 경고 */}
        {isWithdrawalCaution && (
          <ConfirmModal
            width="540px"
            primaryButtonText="예"
            secondaryButtonText="아니요"
            onPrimaryClick={handleWithdrawal}
            onSecondaryClick={() => setIsWithdrawalCaution(false)}
          >
            회원 탈퇴를 하시겠습니까?
            <br />
            탈퇴한 아이디로는 다시 가입할 수 없으며,
            <br />
            아이디 및 데이터는 복구할 수 없습니다.
          </ConfirmModal>
        )}
        {/* 회원탈퇴 완료 */}
        {isWithdrawalComplete && (
          <ConfirmModal
            width="540px"
            primaryButtonText="확인"
            onPrimaryClick={() => setIsWithdrawalComplete(false)}
          >
            계속해서 매칭을 시도하겠습니까?
          </ConfirmModal>
        )}
      </MyProfileContent>
    </Wrapper>
  );
};

export default MyProfilePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MyProfileContent = styled.div`
  width: 100%;
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Profile = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  gap: 26px;
  margin-bottom: 53px;
`;

const Private = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  gap: 35px;
  margin-bottom: 80px;
`;

const Title = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 22px;
  ${(props) => props.theme.fonts.bold25};
  color: ${theme.colors.gray700};
`;

const Small = styled.div`
  ${(props) => props.theme.fonts.bold11};
  color: ${theme.colors.gray800};
  margin-bottom: 5px;
`;

const PrivateContent = styled(Private)`
  width: 100%;
  gap: 31px;
`;

const Box = styled.div`
  width: 100%;
`;

const Label = styled.button`
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.bold14};
  margin-bottom: 13px;
`;

const Email = styled.div`
  width: 100%;
  height: 58px;
  border-radius: 9px;
  padding: 15px 20px;
  border: 1px solid ${theme.colors.gray200};
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular18};
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Password = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const Circle = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 10px;
  background: ${theme.colors.gray700};
`;

const Modify = styled.button`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.bold12};
`;

const P = styled.button`
  ${(props) => props.theme.fonts.bold14};
  color: ${theme.colors.gray200};
  text-decoration-line: underline;
`;
