import { MYPAGE_TAB } from "@/data/tab";
import { theme } from "@/styles/theme";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";

const MypageTab = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <TabContainer>
      {MYPAGE_TAB.map((data) => (
        <Tab
          key={data.id}
          selected={pathname === data.url}
          onClick={() => {
            router.push(data.url);
          }}
        >
          {data.menu}
        </Tab>
      ))}
    </TabContainer>
  );
};

export default MypageTab;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 26px;
`;

const Tab = styled.div<{ selected: boolean }>`
  width: 252px;
  height: 63px;
  padding: 22px 26px;
  border-radius: 4px;
  background: ${({ selected }) =>
    selected ? theme.colors.gray500 : "transparent"};
  color: ${theme.colors.gray600};
  ${({ selected, theme }) =>
    selected ? theme.fonts.bold16 : theme.fonts.regular16};
  cursor: pointer;
`;
