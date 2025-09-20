import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";

import { socketLogout } from "@/api";
import Icon from "@/components/common/Icon";
import { HEADER_MODAL_TAB } from "@/constants";
import { STORAGE_KEY } from "@/constants/storage";
import { useMediaQueryContext } from "@/hooks";
import { closeChat } from "@/redux/slices/chatSlice";
import { setOpenAlertModal } from "@/redux/slices/modalSlice";
import { setNotiCount } from "@/redux/slices/notiSlice";
import {
  clearUserProfile,
  setUserId,
  setUserName,
  setUserProfileImg,
} from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";
import {
  clearTokens,
  getAccessToken,
  getName,
  getProfileBgColor,
  getProfileImg,
  getUserId,
  lockBodyScroll,
  unlockBodyScroll,
} from "@/utils";
import { trackButtonClick } from "@/utils/analytics";
import { authApi, notificationApi } from "@/utils/api";

import AlertWindow from "../alert/AlertWindow";
import ChatButton from "./ChatButton";

import type { RootState } from "@/redux/store";

interface HeaderProps {
  selected: boolean;
}

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isMobile } = useMediaQueryContext();
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

  const storedName = getName();
  const storedProfileImg = Number(getProfileImg());
  const storedUserId = Number(getUserId());

  const isFirstRender = useRef(true);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

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
    trackButtonClick("알림", "navigation", "header");
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

  useEffect(() => {
    unlockBodyScroll();

    if (!isMobile) return;

    if (isMyPage) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }, [isMobile, isMyPage]);

  /* 페이지 이동 시 팝업창 닫음 */
  useEffect(() => {
    setIsAlertWindow(false);
    setIsMyPage(false);
  }, [pathname]);

  const fetchNotiCount = async () => {
    try {
      const response = await notificationApi.getUnreadNotificationCount();
      if (!response.data)
        throw new Error("안 읽은 알림 개수 조회 데이터 응답이 없습니다.");
      dispatch(setNotiCount(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const showLoginAlert = () => {
    dispatch(
      setOpenAlertModal({
        icon: "exclamation",
        width: 68,
        height: 58,
        content: "로그인이 필요한 서비스입니다.",
        alt: "경고",
        buttonText: "확인",
      })
    );
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
      <HeaderBar>
        <LogoButton>
          <Link href="/" onClick={() => trackButtonClick("로고", "navigation", "header")}>
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
          {isMobile && (
            <Menu
              selected={pathname === "/"}
              onClick={() => {
                trackButtonClick("홈", "navigation", "header");
                router.push("/");
              }}
            >
              홈
            </Menu>
          )}

          <Menu
            selected={pathname.includes("/match")}
            onClick={() => {
              trackButtonClick("바로 매칭", "navigation", "header");
              router.push("/match");
            }}
          >
            바로 매칭
          </Menu>
          <Menu
            selected={pathname === "/board"}
            onClick={() => {
              trackButtonClick("게시판", "navigation", "header");
              router.push("/board");
            }}
          >
            {isMobile ? "게시판" : "게시판"}
          </Menu>
        </Menus>
        {accesssToken && name && profileImg ? (
          <Right>
            <IconButton onClick={handleAlertWindow}>
              <Icon
                backgroundUrl={`/assets/icons/noti_${notiCount > 0 ? "on" : "off"}.svg`}
                width={24}
                height={30}
              />
            </IconButton>
            {isMobile && (
              <IconButton>
                <ChatButton />
              </IconButton>
            )}

            <Profile
              ref={myPageDivRef}
              className="profile"
              onClick={() => {
                trackButtonClick("프로필 메뉴", "navigation", "header");
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
              {!isMobile && (
                <>
                  {name}
                  <Icon
                    backgroundUrl={`/assets/icons/chevron_down.svg`}
                    width={7}
                    height={7}
                  />
                </>
              )}
            </Profile>
          </Right>
        ) : (
          <Login onClick={() => {
            trackButtonClick("로그인", "auth", "header");
            router.push("/riot");
          }}>로그인</Login>
        )}
      </HeaderBar>
      {isAlertWindow && (
        <AlertWindow
          countFunc={fetchNotiCount}
          onClose={() => setIsAlertWindow(false)}
          alertButtonRef={alertButtonRef}
        />
      )}
      {isMyPage &&
        createPortal(
          <MyPageModal ref={myPageRef}>
            <Background>
              {isMobile && (
                <MyPageModalHeader>
                  <MyPageModalHeaderTitle>내정보</MyPageModalHeaderTitle>
                  <button onClick={() => {
                    trackButtonClick("모달 닫기", "navigation", "header");
                    setIsMyPage(false);
                  }}>
                    <Icon
                      backgroundUrl={`/assets/icons/close_modal.svg`}
                      width={10}
                      height={10}
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
                <Icon
                  backgroundUrl={`/assets/icons/noti_${notiCount > 0 ? "on" : "off"}.svg`}
                  width={24}
                  height={30}
                  onClick={() => {
                    trackButtonClick("알림 페이지", "navigation", "header");
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
                        trackButtonClick(data.menu, "navigation", "header", { tabId: data.id });
                        setIsMyPage(false);
                        if (data.id !== 6) {
                          router.push(`${data.url}`);
                        } else {
                          sessionStorage.setItem(STORAGE_KEY.logout, "true");
                          try {
                            await authApi.logout();
                            await clearTokens();
                            await socketLogout();
                            localStorage.removeItem(
                              STORAGE_KEY.gamegooSocketId
                            );
                            dispatch(clearUserProfile());
                            sessionStorage.removeItem(
                              STORAGE_KEY.unreadChatUuids
                            );
                            dispatch(closeChat());
                            router.push("/riot");
                          } catch {
                            console.error("소켓 로그아웃 오류");
                          }
                        }
                      }}
                    >
                      <Icon
                        backgroundUrl={`/assets/icons/${data.icon}.svg`}
                        width={20}
                        height={20}
                      />
                      {data.menu}
                    </Line>
                    {index === 3 && <Divider />}
                  </TabItemWrapper>
                ))}
              </TabMenu>
            </Background>
          </MyPageModal>,
          modalRoot
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
  @media (max-width: ${theme.breakpoints.mobile}) {
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    align-items: center;
  }
`;

const LogoButton = styled.button`
  @media (max-width: ${theme.breakpoints.mobile}) {
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

  @media (max-width: ${theme.breakpoints.mobile}) {
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
  @media (max-width: ${theme.breakpoints.mobile}) {
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
  @media (max-width: ${theme.breakpoints.mobile}) {
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
  display: flex;
  justify-content: center;
  align-items: center;
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
  @media (max-width: ${theme.breakpoints.mobile}) {
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
  z-index: ${theme.zIndex.popup};

  @media (max-width: ${theme.breakpoints.mobile}) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
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

const Background = styled.div`
  overflow-y: auto;

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 66px;
    background: ${theme.colors.gray500};
  }
  &::-webkit-scrollbar-track {
    border-radius: 66px;
    background: transparent;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: calc(100vh - 64px);
  }
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
