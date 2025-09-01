import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { useInfiniteScroll, useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";
import { lockBodyScroll, unlockBodyScroll } from "@/utils";
import { notificationApi } from "@/utils/api";

import AlertBox from "../mypage/notification/AlertBox";

import type { Notification } from "@/types";

interface AlertWindowProps {
  countFunc: () => void;
  onClose: () => void;
  alertButtonRef: React.RefObject<HTMLButtonElement>;
}
const AlertWindow = (props: AlertWindowProps) => {
  const { isMobile } = useMediaQueryContext();

  const router = useRouter();
  const { countFunc, onClose, alertButtonRef } = props;

  const alertWindowRef = useRef<HTMLDivElement>(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;
  const [notiList, setNotiList] = useState<Notification[] | undefined>([]);
  const [cursor, setCursor] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean | undefined>(true);
  const sentinelRef = useRef(null); // IntersectionObserver 를 위한 감지용 element

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      // ReportModal이 열려있으면 AlertWindow 닫지 않기
      const target = event.target as Element;
      if (target.closest('.report-modal-overlay') || target.closest('.report-modal-wrapper')) {
        return;
      }
      
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
  const fetchNotiList = async (cursor: number | undefined) => {
    if (isLoading || !hasNext) return;

    setIsLoading(true);
    try {
      const response = await notificationApi.getNotificationListByCursor({
        cursor: cursor,
      });
      if (response.data) {
        const { notificationList, nextCursor, hasNext } = response.data;
        setNotiList((prevNotiList) => [
          ...(prevNotiList ?? []),
          ...(notificationList ?? []),
        ]);
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

  /* 초기 호출 */
  useEffect(
    () => {
      fetchNotiList(cursor);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  /* 무한스크롤 페이지네이션 */
  useInfiniteScroll({
    cursor,
    hasNext,
    isLoading,
    sentinelRef,
    onIntersect: fetchNotiList,
    enabled: true,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (!isMobile) return;
    lockBodyScroll();

    return () => {
      if (modalRoot && modalRoot.children.length === 0) {
        unlockBodyScroll();
      }
    };
  }, [modalRoot, isMobile]);

  /* 알림 읽음 상태 업데이트 */
  const handleReadStatusUpdate = async (notificationId: number | undefined) => {
    const notification = notiList?.find(
      (n) => n.notificationId === notificationId
    );
    if (notification && !notification.read && notificationId) {
      try {
        await notificationApi.readNotification({
          notificationId: notificationId,
        });
        setNotiList((prevNotiList) =>
          prevNotiList?.map((n) =>
            n.notificationId === notificationId ? { ...n, read: true } : n
          )
        );
        countFunc();
      } catch (error) {
        console.error(error);
      }
    }
  };

  /* 알림 읽음으로 상태 변경 */
  const handleClickAlert = async (
    notificationId: number | undefined,
    pageUrl: string | null | undefined
  ) => {
    /* 관련 페이지 이동 */
    if (pageUrl === null || pageUrl === undefined) return;
    router.push(pageUrl);

    /* 읽음 상태 업데이트 */
    await handleReadStatusUpdate(notificationId);
  };

  return createPortal(
    <>
      <Overlay>
        <Wrapper ref={alertWindowRef}>
          <Header>
            <Top>
              <HeaderTitle>알림</HeaderTitle>
              {isMobile ? (
                <>
                  <button onClick={onClose}>
                    <Icon
                      backgroundUrl="/assets/icons/close_modal.svg"
                      width={16}
                      height={16}
                    />
                  </button>
                </>
              ) : (
                <AllButton onClick={handleShowAll}>
                  전체보기
                  <Icon
                    backgroundUrl="/assets/icons/move.svg"
                    width={11}
                    height={11}
                  />
                </AllButton>
              )}
            </Top>
          </Header>
          <Background>
            {notiList !== undefined && notiList.length > 0 ? (
              <>
                {notiList.map((data, index) => (
                  <AlertBox
                    key={`${data.notificationId}-${index}`}
                    notificationId={data.notificationId}
                    notificationType={data.notificationType}
                    pageUrl={data.pageUrl}
                    content={data.content}
                    createdAt={data.createdAt}
                    read={data.read}
                    size="small"
                    onClick={handleClickAlert}
                    onReadStatusUpdate={handleReadStatusUpdate}
                  />
                ))}
                <div ref={sentinelRef}></div>{" "}
                {/* IntersectionObserver 를 위한 감지용 element */}
              </>
            ) : (
              <NoData>새로운 알림이 없습니다.</NoData>
            )}
          </Background>
        </Wrapper>
      </Overlay>
    </>,
    modalRoot
  );
};

export default AlertWindow;

const Overlay = styled.div`
  width: 408px;
  height: 547px;
  position: absolute;
  top: 60px;
  right: 80px;
  z-index: ${theme.zIndex.popup};
  @media (max-width: ${theme.breakpoints.mobile}) {
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
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }
`;

const Header = styled.header`
  border-radius: 20px 20px 0 0;
  background: ${theme.colors.white};
  box-shadow: 0 -1px 10.7px 0 #00000026;
  @media (max-width: ${theme.breakpoints.mobile}) {
    border-radius: 0px;
    background: ${theme.colors.gray100};
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 25px 23px 40px;
  @media (max-width: ${theme.breakpoints.mobile}) {
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

  @media (max-width: ${theme.breakpoints.mobile}) {
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
