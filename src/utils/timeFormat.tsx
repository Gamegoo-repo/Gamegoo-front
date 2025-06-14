import dayjs from "@/libs/dayjs";

export function setDateFormatter(date: string) {
  const now = dayjs();
  const createdAt = dayjs(date);

  const diffInSeconds = now.diff(createdAt, "second");
  const diffInMinutes = now.diff(createdAt, "minute");
  const diffInHours = now.diff(createdAt, "hour");
  const diffInDays = now.diff(createdAt, "day");

  if (diffInSeconds < 60) {
    return `${diffInSeconds}초 전`; // 1분 이내면 초단위로 표시
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`; // 1시간 이내면 분단위로 표시
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`; // 1일 이내면 시간단위로 표시
  } else if (diffInDays < 30) {
    return `${diffInDays}일 전`; // 1달 이내면 날짜단위로 표시
  } else {
    return createdAt.format("YYYY-MM-DD"); // 1달 이후면 'YYYY-MM-DD' 형식으로 표시
  }
}

export function setChatTimeFormatter(date: string) {
  return dayjs(date).format("A h:mm");
}

export function setChatDateFormatter(date: string) {
  return dayjs(date).format("YYYY년 M월 D일");
}

export function setChatRoomDateFormatter(date: string) {
  const now = dayjs();
  const diffHours = now.diff(date, "hour");

  if (diffHours < 24) {
    return dayjs(date).format("A h:mm");
  } else if (diffHours < 36) {
    return "어제";
  } else {
    return dayjs(date).format("YYYY.MM.DD");
  }
}

export function setPostingDateFormatter(date: string) {
  return dayjs(date).format("YYYY.MM.DD HH:mm");
}

export function formatTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      switch (unit) {
        case "year":
          return `${interval}년 전`;
        case "month":
          return `${interval}개월 전`;
        case "day":
          return `${interval}일 전`;
        case "hour":
          return `${interval}시간 전`;
        case "minute":
          return `${interval}분 전`;
        case "second":
          return `${interval}초 전`;
        default:
          return "방금 전";
      }
    }
  }

  return "방금 전";
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}.${month}.${day}`;
}

// 남은 시간을 MM:SS 형식으로 변환
export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};
