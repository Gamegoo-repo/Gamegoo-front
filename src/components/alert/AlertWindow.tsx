import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import AlertBox from "../mypage/alert/AlertBox";
import { EX_ALARM, EX_REQUEST_ALARM } from "@/data/mypage";
import { useRouter } from "next/navigation";

interface AlertWindowProps {
  onClose: () => void;
}

const AlertWindow = (
  props: AlertWindowProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const router = useRouter();
  const { onClose } = props;
  const [activeTab, setActiveTab] = useState<string>("receive");

  const alertWindowRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      alertWindowRef.current &&
      !alertWindowRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <Overlay ref={alertWindowRef}>
        <Wrapper>
          <Header>
            <Top>
              <HeaderTitle>알림</HeaderTitle>
              <AllButton onClick={() => router.push("/mypage/alert")}>
                전체보기
                <Image
                  onClick={onClose}
                  src="/assets/icons/move.svg"
                  width={11}
                  height={11}
                  alt="move button"
                />
              </AllButton>
            </Top>
            <TabContainer>
              <Tab
                $isActive={activeTab === "receive"}
                onClick={() => setActiveTab("receive")}
              >
                받은 알림
              </Tab>
              <Tab
                $isActive={activeTab === "request"}
                onClick={() => setActiveTab("request")}
              >
                친구 요청
              </Tab>
            </TabContainer>
          </Header>
          {activeTab === "receive" && (
            <Background>
              {EX_ALARM.map((data, index) => (
                <AlertBox
                  key={index}
                  content={data.content}
                  time={data.time}
                  read={data.read}
                  size="small"
                />
              ))}
            </Background>
          )}
          {activeTab === "request" && (
            <Background>
              {EX_REQUEST_ALARM.map((data, index) => (
                <AlertBox
                  key={index}
                  content={data.content}
                  time={data.time}
                  read={data.read}
                  size="small"
                />
              ))}
            </Background>
          )}
        </Wrapper>
      </Overlay>
    </>
  );
};

export default AlertWindow;

const Overlay = styled.div`
  width: 408px;
  height: 547px;
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 100;
`;

const Wrapper = styled.div`
  background: ${theme.colors.white};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  width: 418px;
  box-shadow: 0 4px 46.7px 0 #0000001a;
  overflow: hidden;
`;

const Header = styled.header`
  border-radius: 20px 20px 0 0;
  background: ${theme.colors.white};
  box-shadow: 0 -1px 10.7px 0 #00000026;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 23px;
  margin-bottom: 36px;
`;

const HeaderTitle = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray600};
`;

const AllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 1px;
  ${(props) => props.theme.fonts.bold11};
`;

const TabContainer = styled.div`
  display: flex;
  gap: 40px;
  padding: 0 30px;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  position: relative;
  padding: 4px 0;
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray600};
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -2px;
    width: ${(props) => (props.$isActive ? "100%" : "none")};
    height: 4px;
    background-color: ${theme.colors.purple100};
    border-radius: 60px;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
`;

const Background = styled.div`
  height: 435px;
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 14px 19px;
  background: ${theme.colors.gray500};
  overflow-y: auto;

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 66px;
    background: ${theme.colors.gray300};
  }
  &::-webkit-scrollbar-track {
    border-radius: 66px;
    background: transparent;
  }
`;
