// GTM 이벤트 추적 유틸리티

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

interface GTMEvent {
  event: string;
  button_name?: string;
  button_category?: string;
  button_location?: string;
  page_path?: string;
  user_id?: string;
  [key: string]: any;
}

/**
 * GTM에 버튼 클릭 이벤트를 전송합니다
 * @param buttonName 버튼 이름 (예: "로그인", "회원가입", "글쓰기")
 * @param category 버튼 카테고리 (예: "auth", "board", "profile")
 * @param location 버튼 위치 (예: "header", "footer", "main")
 * @param additionalData 추가 데이터
 */
export const trackButtonClick = (
  buttonName: string,
  category?: string,
  location?: string,
  additionalData?: Record<string, any>
) => {
  if (typeof window !== 'undefined') {
    // dataLayer가 존재하지 않으면 초기화
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    const eventData: GTMEvent = {
      event: 'button_click',
      button_name: buttonName,
      button_category: category,
      button_location: location,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    window.dataLayer.push(eventData);
    
    // 개발 환경에서 로그 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('GTM Event:', eventData);
    }
  }
};

/**
 * 페이지뷰 이벤트를 전송합니다
 * @param pagePath 페이지 경로
 * @param pageTitle 페이지 제목
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined') {
    // dataLayer가 존재하지 않으면 초기화
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    window.dataLayer.push({
      event: 'page_view',
      page_path: pagePath,
      page_title: pageTitle || document.title,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * 사용자 이벤트를 전송합니다
 * @param eventName 이벤트 이름
 * @param eventData 이벤트 데이터
 */
export const trackCustomEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // dataLayer가 존재하지 않으면 초기화
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    window.dataLayer.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      ...eventData
    });
  }
};