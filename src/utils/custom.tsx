import dayjs from "@/libs/dayjs";

export function setQueueType(gameMode: number) {
  switch (gameMode) {
    case 1:
      return "빠른대전";
    case 2:
      return "솔로랭크";
    case 3:
      return "자유랭크";
    case 4:
      return "칼바람 나락";
    default:
      return "빠른대전";
  }
}

export function setProfileImg(profile: number) {
  switch (profile) {
    case 1:
      return "/assets/images/profile/profile1.svg";
    case 2:
      return "/assets/images/profile/profile2.svg";
    case 3:
      return "/assets/images/profile/profile3.svg";
    case 4:
      return "/assets/images/profile/profile4.svg";
    case 5:
      return "/assets/images/profile/profile5.svg";
    case 6:
      return "/assets/images/profile/profile6.svg";
    case 7:
      return "/assets/images/profile/profile7.svg";
    case 8:
      return "/assets/images/profile/profile8.svg";
    default:
      return "/assets/images/profile/profile1.svg";
  }
}

export function setPositionImg(position: number) {
  switch (position) {
    case 0:
      return "/assets/icons/position_all_purple.svg";
    case 1:
      return "/assets/icons/position_top_purple.svg";
    case 2:
      return "/assets/icons/position_jungle_purple.svg";
    case 3:
      return "/assets/icons/position_mid_purple.svg";
    case 4:
      return "/assets/icons/position_one_deal_purple.svg";
    case 5:
      return "/assets/icons/position_supporter_purple.svg";
    default:
      return "/assets/icons/position_all_purple.svg";
  }
}

export function setDateFormatter(date: string) {
  const now = dayjs();
  const diff = now.diff(date, "day");
  if (diff >= 7) {
    return dayjs(date).format("YYYY-MM-DD");
  } else {
    return dayjs(date).fromNow();
  }
}

export function setChatTimeFormatter(date: string) {
  return dayjs(date).format("A h:m");
}

export function setChatDateFormatter(date: string) {
  return dayjs(date).format("YYYY년 M월 D일");
}

export function setChatRoomDateFormatter(date: string) {
  const now = dayjs();
  const diffHours = now.diff(date, "hour");

  if (diffHours < 24) {
    return dayjs(date).format("A h:m");
  } else if (diffHours < 36) {
    return "어제";
  } else {
    return dayjs(date).format("YYYY.MM.DD");
  }
}

export function setPostingDateFormatter(date: string) {
  return dayjs(date).format('YYYY.MM.DD HH:mm');
};

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
