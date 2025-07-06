import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import styled from "styled-components";

import { getUnreadNotificationCount, postLogout, socketLogout } from "@/api";
import { HEADER_MODAL_TAB } from "@/constants";
import { useMediaQueries } from "@/hooks";
import { closeChat } from "@/redux/slices/chatSlice";
import { setNotiCount } from "@/redux/slices/notiSlice";
import {
  clearUserProfile,
  setUserId,
  setUserName,
  setUserProfileImg,
} from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import { getProfileBgColor } from "@/utils";
import {
  clearTokens,
  getAccessToken,
  getName,
  getProfileImg,
  getUserId,
} from "@/utils";

import AlertWindow from "../alert/AlertWindow";
import Alert from "./Alert";
import ChatButton from "./ChatButton";

interface HeaderProps {
  selected: boolean;
}

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const pathname = usePathname();
  const [isAlertWindow, setIsAlertWindow] = useState<Boolean>(false);
  const [isMyPage, setIsMyPage] = useState<Boolean>(false);

  const accesssToken = getAccessToken(); // 로그인 유무 결정
  const name = useSelector((state: RootState) => state.user.gameName);
  const profileImg = useSelector((state: RootState) => state.user.profileImg);
  const notiCount = useSelector((state: RootState) => state.noti.count);

  const alertButtonRef = useRef<HTMLButtonElement>(null);
  const myPageDivRef = useRef<HTMLDivElement>(null);

  const myPageRef = useRef<HTMLDivElement>(null);
  const [showAlert, setShowAlert] = useState(false);

  const storedName = getName();
  const storedProfileImg = Number(getProfileImg());
  const storedUserId = Number(getUserId());

  const isFirstRender = useRef(true);

  useEffect(
    () => {
      if (storedName) {
        dispatch(setUserName(storedName));
      }
      if (storedProfileImg) {
        dispatch(setUserProfileImg(storedProfileImg));
      }
      if (storedUserId) {
        dispatch(setUserId(storedUserId));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* 알림창 열고 닫는 함수 */
  const handleAlertWindow = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsAlertWindow((prev) => !prev);
  };

  /* 마이페이지 모달 외부 영역 클릭시 팝업 닫힘 */
  const handleClickOutside = (event: MouseEvent) => {
    if (
      myPageRef.current &&
      !myPageRef.current.contains(event.target as Node) &&
      !(
        myPageDivRef.current &&
        myPageDivRef.current.contains(event.target as Node)
      )
    ) {
      setIsMyPage(false);
    }
  };

  useEffect(() => {
    if (isMyPage) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  }, [isMyPage]);

  /* 페이지 이동 시 팝업창 닫음 */
  useEffect(() => {
    setIsAlertWindow(false);
    setIsMyPage(false);
  }, [pathname]);

  const fetchNotiCount = async () => {
    try {
      const response = await getUnreadNotificationCount();
      dispatch(setNotiCount(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(
    () => {
      // 첫 렌더에서만 API 호출
      if (isFirstRender.current && storedName) {
        fetchNotiCount();
        isFirstRender.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storedName]
  );

  useEffect(() => {}, [notiCount]);

  return (
    <Head>
      {showAlert && (
        <Alert
          icon="exclamation"
          width={68}
          height={58}
          content="로그인이 필요한 서비스입니다."
          alt="경고"
          onClose={() => setShowAlert(false)}
          buttonText="확인"
        />
      )}

      <HeaderBar>
        <LogoButton>
          <Link href="/">
            <Image
              src="/assets/icons/logo.svg"
              width={102}
              height={32}
              alt="logo"
              priority
            />
          </Link>
        </LogoButton>

        <Menus>
          {isMobile ? (
            <Menu
              selected={pathname === "/"}
              onClick={() => {
                router.push("/");
              }}
            >
              홈
            </Menu>
          ) : (
            <></>
          )}

          <Menu
            selected={pathname.includes("/match")}
            onClick={() => {
              if (!accesssToken) {
                setShowAlert(true);
              } else {
                router.push("/match");
              }
            }}
          >
            바로 매칭
          </Menu>
          <Menu
            selected={pathname === "/board"}
            onClick={() => {
              router.push("/board");
            }}
          >
            {isMobile ? "게시판" : "게시판"}
          </Menu>
        </Menus>
        {accesssToken && name && profileImg ? (
          <Right>
            <IconButton>
              <Image
                src={`/assets/icons/noti_${notiCount > 0 ? "on" : "off"}.svg`}
                width={24}
                height={30}
                alt="noti"
                onClick={handleAlertWindow}
              />
            </IconButton>
            {isMobile ? (
              <IconButton>
                <ChatButton />
              </IconButton>
            ) : (
              <></>
            )}

            <Profile
              ref={myPageDivRef}
              className="profile"
              onClick={() => {
                // if (isMobile) {
                //   router.push("/mypage/profile");
                //   return;
                // }

                setIsMyPage(!isMyPage);
              }}
            >
              <HeaderProfileImgWrapper $bgColor={getProfileBgColor(profileImg)}>
                <HeaderProfileImg
                  data={`/assets/images/profile/profile${profileImg}.svg`}
                  width={25}
                  height={25}
                />
              </HeaderProfileImgWrapper>
              {isMobile ? (
                <></>
              ) : (
                <>
                  {name}
                  <Image
                    src="/assets/icons/chevron_down.svg"
                    width={7}
                    height={7}
                    alt="more"
                  />
                </>
              )}
            </Profile>
          </Right>
        ) : (
          <Login onClick={() => router.push("/riot")}>로그인</Login>
        )}
      </HeaderBar>
      {isAlertWindow && (
        <AlertWindow
          countFunc={fetchNotiCount}
          onClose={() => setIsAlertWindow(false)}
          alertButtonRef={alertButtonRef}
        />
      )}
      {isMyPage && (
        <MyPageModal ref={myPageRef}>
          {isMobile && (
            <MyPageModalHeader>
              <MyPageModalHeaderTitle>내정보</MyPageModalHeaderTitle>
              <button>
                <Image
                  src="/assets/icons/close_modal.svg"
                  width={16}
                  height={16}
                  alt="닫기"
                  onClick={() => setIsMyPage(false)}
                  style={{ cursor: "pointer" }}
                />
              </button>
            </MyPageModalHeader>
          )}

          <MyProfile>
            {profileImg && (
              <ProfileImgWrapper $bgColor={getProfileBgColor(profileImg)}>
                <ProfileImg
                  data={`/assets/images/profile/profile${profileImg}.svg`}
                  width={52}
                  height={62}
                />
              </ProfileImgWrapper>
            )}
            <MyName>{name}</MyName>
            <Image
              src={`/assets/icons/noti_${notiCount > 0 ? "on" : "off"}.svg`}
              width={24}
              height={30}
              alt="noti"
              onClick={() => {
                router.push("/mypage/notification");
                setIsMyPage(false);
              }}
              style={{ cursor: "pointer" }}
            />
          </MyProfile>
          <TabMenu>
            {HEADER_MODAL_TAB.map((data, index) => (
              <TabItemWrapper key={data.id}>
                <Line
                  onClick={async () => {
                    setIsMyPage(false);
                    if (data.id !== 6) {
                      router.push(`${data.url}`);
                    } else {
                      sessionStorage.setItem("logout", "true");
                      try {
                        await postLogout();
                        await clearTokens();
                        await socketLogout();
                        localStorage.removeItem("gamegooSocketId");
                        dispatch(clearUserProfile());
                        sessionStorage.removeItem("unreadChatUuids");
                        dispatch(closeChat());
                        router.push("/riot");
                      } catch {
                        console.error("소켓 로그아웃 오류");
                      }
                    }
                  }}
                >
                  <Image
                    src={`/assets/icons/${data.icon}.svg`}
                    width={20}
                    height={20}
                    alt={`${data.icon}`}
                  />
                  {data.menu}
                </Line>
                {index === 3 && <Divider />}
              </TabItemWrapper>
            ))}
          </TabMenu>
        </MyPageModal>
      )}
    </Head>
  );
};

export default Header;

const Head = styled.div`
  width: 100%;
  margin-top: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  ${(props) => props.theme.fonts.regular14};
  position: relative;
  @media (max-width: 700px) {
    margin-top: 20px;
    justify-content: space-between;
  }
`;

const HeaderBar = styled.div`
  max-width: 1440px;
  box-sizing: border-box;
  padding: 0 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;

  @media screen and (max-width: 700px) {
    padding: 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    align-items: center;
  }
`;

const LogoButton = styled.button`
  @media screen and (max-width: 700px) {
    margin-left: 20px;
    grid-column: 1;
    justify-self: start;
  }
`;

const Menus = styled.div`
  display: flex;
  gap: 40px;
  flex-grow: 1;
  justify-content: flex-start;
  margin-left: 70px;

  @media screen and (max-width: 700px) {
    width: 100%;
    grid-column: 1 / span 2;
    display: flex;
    gap: 42px;
    margin: 10px 0 0;
    padding: 0 20px;
    border-bottom: 1px solid ${theme.colors.gray300};
  }
`;

const Menu = styled.button<HeaderProps>`
  ${(props) => props.theme.fonts.regular20};
  font-weight: ${({ selected }) => (selected ? "700" : "400")};
  color: ${theme.colors.gray800};
  @media screen and (max-width: 700px) {
    ${(props) => props.theme.fonts.semiBold14};
    padding: 10px 0;
    border-bottom: ${({ selected }) =>
      selected ? `3px solid ${theme.colors.gray800}` : "none"};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  @media screen and (max-width: 700px) {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
    margin-right: 20px;
  }
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  &:active {
    background-color: ${theme.colors.violet100};
  }
`;
const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const HeaderProfileImgWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 37px;
  height: 37px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const HeaderProfileImg = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const Login = styled.button`
  background: ${theme.colors.violet600};
  color: ${theme.colors.white};
  padding: 8px 24px;
  border-radius: 6px;
  ${(props) => props.theme.fonts.bold18}
  @media screen and (max-width: 700px) {
    background: none;
    color: ${theme.colors.violet600};
    ${(props) => props.theme.fonts.bold14}
    padding: 0;
    margin-right: 20px;
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
  }
`;

const MyPageModal = styled.div`
  width: 408px;
  border-radius: 10px;
  padding: 25px 27px;
  background: ${theme.colors.white};
  box-shadow: 2px 11px 44.1px 0px rgba(0, 0, 0, 0.15);
  position: absolute;
  top: 60px;
  right: 80px;
  z-index: 100;

  @media (max-width: 700px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    box-shadow: none;
  }
`;

const MyPageModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const MyPageModalHeaderTitle = styled.div`
  ${theme.fonts.bold20}
  ${theme.colors.gray800}
`;

const MyProfile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 9px 23px 9px;
  border-bottom: 1px solid ${theme.colors.gray300};
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 75px;
  height: 75px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const ProfileImg = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const MyName = styled.div`
  margin-left: 15px;
  margin-right: auto;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.bold20};
  white-space: nowrap;
`;

const TabMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-top: 18px;
  gap: 4px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.semiBold18};
`;

const TabItemWrapper = styled.div`
  width: 100%;
`;

const Line = styled.div`
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 9px;
  gap: 18px;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    background: ${theme.colors.gray100};
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.colors.gray300};
  margin: 18px 0;
`;
