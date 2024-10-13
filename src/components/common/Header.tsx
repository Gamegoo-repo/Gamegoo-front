import { HEADER_MODAL_TAB } from "@/data/tab";
import { theme } from "@/styles/theme";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AlertWindow from "../alert/AlertWindow";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTokens,
  getAccessToken,
  getName,
  getProfileImg,
} from "@/utils/storage";
import { getProfileBgColor } from "@/utils/profile";
import {
  clearUserProfile,
  setUserName,
  setUserProfileImg,
} from "@/redux/slices/userSlice";
import { getNotiCount } from "@/api/notification";
import { RootState } from "@/redux/store";
import Alert from "./Alert";
import { setNotiCount } from "@/redux/slices/notiSlice";
import { socketLogout } from "@/api/socket";
import { closeChat } from "@/redux/slices/chatSlice";

interface HeaderProps {
  selected: boolean;
}

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isAlertWindow, setIsAlertWindow] = useState<Boolean>(false);
  const [isMyPage, setIsMyPage] = useState<Boolean>(false);

  const accesssToken = getAccessToken(); // 로그인 유무 결정
  const name = useSelector((state: RootState) => state.user.gameName);
  const profileImg = useSelector((state: RootState) => state.user.profileImg);
  const notiCount = useSelector((state: RootState) => state.noti.count);

  const myPageRef = useRef<HTMLDivElement>(null);
  const [showAlert, setShowAlert] = useState(false);

  const storedName = getName();
  const storedProfileImg = Number(getProfileImg());

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (storedName) {
      dispatch(setUserName(storedName));
    }
    if (storedProfileImg) {
      dispatch(setUserProfileImg(storedProfileImg));
    }
  }, []);

  /* 알림창 열고 닫는 함수 */
  const handleAlertWindow = () => {
    setIsAlertWindow(!isAlertWindow);
  };

  /* 외부 영역 클릭시 팝업 닫힘 */
  const handleClickOutside = (event: MouseEvent) => {
    if (
      myPageRef.current &&
      !myPageRef.current.contains(event.target as Node)
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
      const response = await getNotiCount();
      // setCount(response.result);
      dispatch(setNotiCount(response.result));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // 첫 렌더에서만 API 호출
    if (isFirstRender.current && storedName) {
      fetchNotiCount();
      isFirstRender.current = false;
    }
  }, [storedName]);

  useEffect(() => {
  }, [notiCount]);

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
        <Left>
          <Link href="/">
            <Image
              src="/assets/icons/logo.svg"
              width={102}
              height={32}
              alt="logo"
              priority
            />
          </Link>
          <Menus>
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
            <Bar />
            <Menu
              selected={pathname === "/board"}
              onClick={() => {
                router.push("/board");
              }}
            >
              매칭 게시판
            </Menu>
          </Menus>
        </Left>
        {accesssToken && name && profileImg ? (
          <Right>
            <Image
              src={`/assets/icons/noti_${notiCount > 0 ? "on" : "off"}.svg`}
              width={24}
              height={30}
              alt="noti"
              onClick={handleAlertWindow}
            />
            <Profile
              className="profile"
              onClick={() => {
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
              {name}
              <Image
                src="/assets/icons/chevron_down.svg"
                width={7}
                height={7}
                alt="more"
              />
            </Profile>
          </Right>
        ) : (
          <Login onClick={() => router.push("/login")}>로그인</Login>
        )}
      </HeaderBar>
      {isAlertWindow && (
        <AlertWindow
          countFunc={fetchNotiCount}
          onClose={() => setIsAlertWindow(false)}
        />
      )}
      {isMyPage && (
        <MyPageModal ref={myPageRef}>
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
                      sessionStorage.setItem('logout', 'true');
                      try {
                        // 토큰을 먼저 삭제해야 로그아웃 후 소켓 생성 시 토큰이 전달되지 않음.
                        await clearTokens();
                        const response = await socketLogout();
                        sessionStorage.removeItem("gamegooSocketId");
                        dispatch(clearUserProfile());
                        sessionStorage.removeItem("unreadChatUuids");
                        dispatch(closeChat());
                        router.push('/login');
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
                {index === 2 && <Divider />}
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
`;

const Menus = styled.div`
  display: flex;
  gap: 25px;
`;

const Menu = styled.button<HeaderProps>`
  ${(props) => props.theme.fonts.regular14};
  font-weight: ${({ selected }) => (selected ? "700" : "400")};
`;

const Bar = styled.div`
  width: 0.5px;
  height: 18.5px;
  background: #d7d7d7;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
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
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.bold14}
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
`;

const MyProfile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 9px 23px 9px;
  border-bottom: 1px solid #d4d4d4;
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
  color: ${theme.colors.black};
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
  color: ${theme.colors.black};
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
    background: ${theme.colors.gray500};
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d4d4d4;
  margin: 18px 0;
`;
