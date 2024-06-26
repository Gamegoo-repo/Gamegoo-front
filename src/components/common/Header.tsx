import { HEADER_MODAL_TAB } from "@/data/tab";
import { theme } from "@/styles/theme";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

interface HeaderProps {
  selected: boolean;
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMyPage, setIsMyPage] = useState<Boolean>(false);

  return (
    <Head>
      <HeaderBar>
        <Left>
          <Link href="/home">
            <Image
              src="/assets/icons/logo.svg"
              width={102}
              height={32}
              alt="logo"
            />
          </Link>
          <Menus>
            <Menu
              href="/match"
              selected={
                pathname === "/match" ||
                pathname === "/match/type" ||
                pathname === "/game-mode"
              }
            >
              바로 매칭
            </Menu>
            <Bar />
            <Menu href="board" selected={pathname === "/board"}>
              매칭 게시판
            </Menu>
          </Menus>
        </Left>
        <Right>
          <Image
            src="/assets/icons/noti_on.svg"
            width={24}
            height={30}
            alt="noti"
            onClick={() => router.push("/")}
          />
          <Profile>
            <Image
              src="/assets/images/profile.svg"
              width={29}
              height={29}
              alt="profile"
            />
            장시은
            <button onClick={() => setIsMyPage(!isMyPage)}>
              <Image
                src="/assets/icons/chevron_down.svg"
                width={7}
                height={7}
                alt="more"
              />
            </button>
          </Profile>
        </Right>
      </HeaderBar>
      {isMyPage && (
        <MyPageModal>
          <MyProfile>
            <Image
              src="/assets/images/profile.svg"
              width={75}
              height={75}
              alt="profile"
            />
            <MyName>장시은</MyName>
            <Image
              src="/assets/icons/noti_on.svg"
              width={24}
              height={30}
              alt="noti"
            />
          </MyProfile>
          <TabMenu>
            {HEADER_MODAL_TAB.map((data, index) => (
              <Line key={data.id} className={index === 2 ? "with-border" : ""}>
                <Image
                  src={`/assets/icons/${data.icon}.svg`}
                  width={20}
                  height={20}
                  alt={`${data.icon}`}
                  onClick={() => router.push(`${data.url}`)}
                />
                {data.menu}
              </Line>
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
  position: absolute;
  top: 0;
`;

const HeaderBar = styled.div`
  max-width: 1440px;
  box-sizing: border-box;
  padding: 0 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Menus = styled.div`
  display: flex;
  gap: 25px;
`;

const Menu = styled(Link)<HeaderProps>`
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
`;

const MyPageModal = styled.div`
  width: 408px;
  height: 507px;
  border-radius: 10px;
  padding: 25px 27px;
  background: ${theme.colors.white};
  box-shadow: 2px 11px 44.1px 0px rgba(0, 0, 0, 0.15);
  position: absolute;
  top: 50px;
  right: 10px;
  z-index: 100;
`;

const MyProfile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 9px 23px 9px;
  border-bottom: 1px solid #d4d4d4;
`;

const MyName = styled.div`
  margin-left: 15px;
  margin-right: 170px;
  color: ${theme.colors.black};
  ${(props) => props.theme.fonts.bold20};
`;

const TabMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 34px 0px;
  gap: 34px;
  color: ${theme.colors.black};
  ${(props) => props.theme.fonts.semiBold18};
`;

const Line = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 9px;
  gap: 18px;

  &.with-border {
    border-bottom: 1px solid #d4d4d4;
    padding-bottom: 34px;
  }
`;
