import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { getPopupNotification, patchReadNotification } from "@/api";
import { useMediaQueries } from "@/hooks";
import { theme } from "@/styles/theme";

import AlertBox from "../mypage/notification/AlertBox";

import type { Notification } from "@/types";

interface AlertWindowProps {
  countFunc: () => void;
  onClose: () => void;
  alertButtonRef: React.RefObject<HTMLButtonElement>;
}
const AlertWindow = (props: AlertWindowProps) => {
  const isMobile = useMediaQueries({ breakpoint: 700 });

  const router = useRouter();
  const { countFunc, onClose, alertButtonRef } = props;

  const alertWindowRef = useRef<HTMLDivElement>(null);

  const [notiList, setNotiList] = useState<Notification[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(true);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        alertWindowRef.current &&
        !alertWindowRef.current.contains(event.target as Node) &&
        !(
          alertButtonRef.current &&
          alertButtonRef.current.contains(event.target as Node)
        )
      ) {
        onClose();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  /* 전체 보기 */
  const handleShowAll = () => {
    router.push("/mypage/notification");
    onClose();
  };

  /* 알림 목록 조회 */
  const fetchNotiList = async (cursor: number | null) => {
    if (isLoading || !hasNext) return;

    setIsLoading(true);
    try {
      const response = await getPopupNotification(cursor);
      if (response.data) {
        const { notificationList, nextCursor, hasNext } = response.data;
        setNotiList((prevNotiList) => [...prevNotiList, ...notificationList]);
        setCursor(nextCursor);
        setHasNext(hasNext);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* 알림 팝업 - 스크롤이 끝에 도달하면 다음 페이지 가져오기 */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!cursor) return;

    const bottom =
      e.currentTarget.scrollTop + e.currentTarget.clientHeight >=
      e.currentTarget.scrollHeight - 20;
    if (hasNext && bottom && !isLoading) {
      fetchNotiList(cursor);
    }
  };

  /* 초기 호출 */
  useEffect(
    () => {
      fetchNotiList(cursor);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* 알림 읽음으로 상태 변경 */
  const handleClickAlert = async (
    notificationId: number,
    pageUrl: string | null
  ) => {
    /* 관련 페이지 이동 */
    if (pageUrl !== null) {
      router.push(pageUrl);
    }

    /* 읽음 상태 업데이트 */
    const notification = notiList.find(
      (n) => n.notificationId === notificationId
    );
    if (notification && !notification.read) {
      try {
        await patchReadNotification(notificationId);
        setNotiList((prevNotiList) =>
          prevNotiList.map((n) =>
            n.notificationId === notificationId ? { ...n, read: true } : n
          )
        );
        countFunc();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Overlay>
        <Wrapper ref={alertWindowRef}>
          <Header>
            <Top>
              <HeaderTitle>알림</HeaderTitle>
              {isMobile ? (
                <>
                  <button>
                    <Image
                      src="/assets/icons/close_modal.svg"
                      width={16}
                      height={16}
                      alt="닫기"
                      onClick={onClose}
                      style={{ cursor: "pointer" }}
                    />
                  </button>
                </>
              ) : (
                <AllButton onClick={handleShowAll}>
                  전체보기
                  <Image
                    src="/assets/icons/move.svg"
                    width={11}
                    height={11}
                    alt="move button"
                  />
                </AllButton>
              )}
            </Top>
            {/* <TabContainer>
              <Tab>받은 알림</Tab>
            </TabContainer> */}
          </Header>
          <Background onScroll={handleScroll}>
            {notiList.length > 0 ? (
              notiList.map((data, index) => (
                <AlertBox
                  key={`${data.notificationId}-${index}`}
                  notificationId={data.notificationId}
                  notificationtType={data.notificationType}
                  pageUrl={data.pageUrl}
                  content={data.content}
                  createdAt={data.createdAt}
                  read={data.read}
                  size="small"
                  onClick={handleClickAlert}
                />
              ))
            ) : (
              <NoData>새로운 알림이 없습니다.</NoData>
            )}
          </Background>
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
  top: 60px;
  right: 80px;
  z-index: 100;
  @media (max-width: 700px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: unset;
  }
`;

const Wrapper = styled.div`
  width: 418px;
  height: 547px;
  background: ${theme.colors.white};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 46.7px 0 #0000001a;
  @media (max-width: 700px) {
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }
`;

const Header = styled.header`
  border-radius: 20px 20px 0 0;
  background: ${theme.colors.white};
  box-shadow: 0 -1px 10.7px 0 #00000026;
  @media (max-width: 700px) {
    border-radius: 0px;
    background: ${theme.colors.gray100};
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 25px 23px 40px;
  @media (max-width: 700px) {
    padding: 17px 20px;
  }
`;

const HeaderTitle = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray800};
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

const Tab = styled.button`
  position: relative;
  padding: 4px 0;
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray800};
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -2px;
    width: 100%;
    height: 4px;
    background-color: ${theme.colors.violet600};
    border-radius: 60px;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
`;

const Background = styled.div`
  height: 461px;
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 14px 19px;
  background: ${theme.colors.gray100};
  overflow-y: auto;
  border-radius: 0 0 20px 20px;

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

  @media (max-width: 700px) {
    height: calc(100vh - 64px);
    border-radius: 0;
  }
`;

const NoData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.gray600};
  ${theme.fonts.regular16}
`;
