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
};

export function setProfileImg(profile: number) {
    switch (profile) {
        case 1:
            return '/assets/images/profile/profile1.svg';
        case 2:
            return '/assets/images/profile/profile2.svg';
        case 3:
            return '/assets/images/profile/profile3.svg';
        case 4:
            return '/assets/images/profile/profile4.svg';
        case 5:
            return '/assets/images/profile/profile5.svg';
        case 6:
            return '/assets/images/profile/profile6.svg';
        case 7:
            return '/assets/images/profile/profile7.svg';
        case 8:
            return '/assets/images/profile/profile8.svg';
        default:
            return '/assets/images/profile/profile1.svg';
    };
};

export function setPositionImg(position: number) {
    switch (position) {
        case 1:
            return '/assets/icons/position_random_purple.svg';
        case 2:
            return '/assets/icons/position_top_purple.svg';
        case 3:
            return '/assets/icons/position_jungle_purple.svg';
        case 4:
            return '/assets/icons/position_mid_purple.svg';
        case 5:
            return '/assets/icons/position_one_deal_purple.svg';
        case 6:
            return '/assets/icons/position_supporter_purple.svg';
        default:
            return '/assets/icons/position_random_purple.svg';
    };
};

export function setTierImg(tier: string) {
    switch (tier) {
        case "IRON":
            return '/assets/images/tier/iron.svg';
        case "BRONZE":
            return '/assets/images/tier/bronze.svg';
        case "SILVER":
            return '/assets/images/tier/silver.svg';
        case "GOLD":
            return '/assets/images/tier/gold.svg';
        case "PLATINUM":
            return '/assets/images/tier/platinum.svg';
        case "EMERALD":
            return '/assets/images/tier/emerald.svg';
        case "DIAMOND":
            return '/assets/images/tier/diamond.svg';
        case "MASTER":
            return '/assets/images/tier/master.svg';
        case "GRANDMASTER":
            return '/assets/images/tier/grandmaster.svg';
        case "CHALLENGER":
            return '/assets/images/tier/challenger.svg';
        default:
            return '/assets/images/tier/unrank.svg';
    };
};

export function setDateFormatter(date: string) {
    const now = dayjs();
    const diff = now.diff(date, 'day')
    if (diff >= 7) {
        return dayjs(date).format("YYYY-MM-DD");
    } else {
        return dayjs(date).fromNow();
    }
};

export function setChatTimeFormatter(date: string) {
    return dayjs(date).format('A h:m');
};

export function setChatDateFormatter(date: string) {
    return dayjs(date).format('YYYY년 M월 D일');
};

export function setChatRoomDateFormatter(date: string) {
    const now = dayjs();
    const diffHours = now.diff(date, 'hour');

    if (diffHours < 24) {
        return dayjs(date).format('A h:m');
    } else if (diffHours < 36) {
        return '어제';
    } else {
        return dayjs(date).format('YYYY.MM.DD');
    }
};

export function setPostingDateFormatter(date: string) {
    return dayjs(date).format('YYYY.MM.DD hh:mm');
};