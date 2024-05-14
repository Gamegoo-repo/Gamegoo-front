import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";

interface HeaderProps {
  selected: boolean;
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Head>
      <HeaderBar>
        <Left>
          <Link href="/">
            <Image
              src="/assets/icons/logo.svg"
              width={102}
              height={32}
              alt="logo"
            />
          </Link>
          <Menus>
            <Menu href="match" selected={pathname === "/match"}>
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
          <button>프로필</button>
        </Right>
      </HeaderBar>
    </Head>
  );
};

export default Header;

const Head = styled.div`
  width: 100%;
  height: 50px;
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
