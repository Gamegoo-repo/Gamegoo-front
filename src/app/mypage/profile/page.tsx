"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import MyPageProfile from "@/components/mypage/profile/MyPageProfile";
import PasswordModal from "@/components/mypage/profile/PasswordModal";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { setUserMike, setUserProfile } from "@/redux/slices/userSlice";
import useMediaQueries from "@/hooks/useMediaQueries";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatDate } from "@/utils/timeFormat";
// import Input from "@/components/common/Input";
// import { checkPassword } from "@/api/password/password";
import { clearTokens } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/api/user/profile/get";
import { deleteMember } from "@/api/user/delete";
import Image from "next/image";

const passwordLength = 10;

const MyProfilePage = () => {
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const circles = Array.from({ length: passwordLength });

  const [isPasswordModify, setIsPasswordModify] = useState<boolean>(false);

  // const [password, setPassword] = useState("");
  /* 현재 비밀번호 일치 여부 */
  // const [isPasswordValid, setIsPasswordValid] = useState<boolean | undefined>();

  /* 회원탈퇴 모달 */
  const [isWithdrawalCaution, setIsWithdrawalCaution] =
    useState<boolean>(false);
  const [isWithdrawalComplete, setIsWithdrawalComplete] =
    useState<boolean>(false);

  const handleWithdrawal = async () => {
    // 회원탈퇴 API 연동
    try {
      // await checkPassword(password);
      // setIsPasswordValid(true);

      await deleteMember();
      setIsWithdrawalCaution(false);
      setIsWithdrawalComplete(true);
      clearTokens();
      setTimeout(() => {
        router.push("/riot");
      }, 2000);
    } catch (error) {
      // setIsPasswordValid(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        dispatch(setUserProfile(response.data));
        dispatch(setUserMike(response.data.mike));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  /* user 업데이트 값 가져오기 */
  useEffect(() => {
    // 필요한 로직을 여기에 추가
  }, [user]);

  return (
    <Wrapper>
      <MyProfileContent>
        <Profile>
          <Title>
            내 정보
            <RiotInfo>
              <RiotObject
                data={"/assets/icons/riot_red.svg"}
                width={!isMobile ? 16 : 10}
                height={!isMobile ? 16 : 9}
              />
              라이엇 연동 완료
            </RiotInfo>
          </Title>

          <MyPageProfile user={user} />
        </Profile>
        {/* <Private>
          <Title>
            개인정보
            {user.updatedAt && (
              <Small>{`마지막 업데이트 : ${formatDate(user.updatedAt)}`}</Small>
            )}
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
        </Private> */}
        <P onClick={() => setIsWithdrawalCaution(true)}>회원탈퇴</P>
        {/* 회원탈퇴 경고 */}
        {isWithdrawalCaution && (
          <ConfirmModal
            width="540px"
            primaryButtonText="회원 탈퇴"
            secondaryButtonText="취소"
            onPrimaryClick={handleWithdrawal}
            onSecondaryClick={() => setIsWithdrawalCaution(false)}
            type="withDrawer"
          >
            <ModalContent>
              <div>
                회원 탈퇴를 하시겠습니까?
                <br />
                탈퇴한 아이디로는 다시 가입할 수 없으며,
                <br />
                아이디 및 데이터는 복구할 수 없습니다.
              </div>
              {/* <Input
                inputType="password"
                value={password}
                label="현재 비밀번호"
                onChange={(value) => {
                  setPassword(value);
                  setIsPasswordValid(undefined);
                }}
                placeholder="현재 비밀번호 입력"
                isvalid={isPasswordValid}
              /> */}
            </ModalContent>
          </ConfirmModal>
        )}
        {/* 회원탈퇴 완료 */}
        {isWithdrawalComplete && (
          <ConfirmModal
            width="540px"
            primaryButtonText="확인"
            onPrimaryClick={() => setIsWithdrawalComplete(false)}
          >
            회원탈퇴가 완료되었습니다.
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
  @media (max-width: 700px) {
    padding: 30px 20px;
  }
`;

const MyProfileContent = styled.div`
  width: 100%;
  max-width: 1440px;
  width: 100%;
  @media (max-width: 700px) {
    padding: 0;
  }
`;

const Profile = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  gap: 26px;
  margin-bottom: 53px;
  @media (max-width: 700px) {
    margin-bottom: 28px;
  }
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
  align-items: center;
  gap: 22px;
  ${(props) => props.theme.fonts.bold25};
  color: ${theme.colors.gray800};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.semiBold18};
    gap: 9px;
  }
`;

const RiotInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  ${(props) => props.theme.fonts.bold13};
  color: ${theme.colors.red600};
  border: 1px solid ${theme.colors.red600};
  padding: 4px 12px;
  border-radius: 999px;

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.bold11};
    padding: 4px 8px;
  }
`;

const RiotObject = styled.object`
  pointer-events: none;
`;

// const Small = styled.div`
//   ${(props) => props.theme.fonts.bold11};
//   color: ${theme.colors.gray400};
//   margin-bottom: 5px;
// `;

// const PrivateContent = styled(Private)`
//   width: 100%;
//   gap: 31px;
// `;

// const Box = styled.div`
//   width: 100%;
// `;

// const Label = styled.button`
//   color: ${theme.colors.gray600};
//   ${(props) => props.theme.fonts.bold14};
//   margin-bottom: 13px;
// `;

// const Email = styled.div`
//   width: 100%;
//   height: 58px;
//   border-radius: 9px;
//   padding: 15px 20px;
//   border: 1px solid ${theme.colors.gray200};
//   color: ${theme.colors.gray800};
//   ${(props) => props.theme.fonts.regular18};
// `;
// const Row = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const Password = styled.button`
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   gap: 8px;
// `;

// const Circle = styled.div`
//   width: 5px;
//   height: 5px;
//   border-radius: 10px;
//   background: ${theme.colors.gray700};
// `;

// const Modify = styled.button`
//   color: ${theme.colors.violet600};
//   ${(props) => props.theme.fonts.bold12};
// `;

const P = styled.button`
  ${(props) => props.theme.fonts.bold14};
  color: ${theme.colors.red600};
  background: ${theme.colors.red100};
  border-radius: 4px;
  padding: 12px 20px;
  @media (max-width: 700px) {
    border-radius: 8px;
    padding: 16px;
  }
`;

const ModalContent = styled.div`
  padding: 46px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 700px) {
    padding: 35px 0;
  }
`;
