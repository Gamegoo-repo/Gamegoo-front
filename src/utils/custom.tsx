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

export function setProfileImg(profile: string) {
    switch (profile) {
        case "default":
            return '/assets/images/profile/profile1.svg';
        case "profile1":
            return '/assets/images/profile/profile2.svg';
        case "profile2":
            return '/assets/images/profile/profile3.svg';
        case "profile3":
            return '/assets/images/profile/profile4.svg';
        case "profile4":
            return '/assets/images/profile/profile5.svg';
        case "profile5":
            return '/assets/images/profile/profile6.svg';
        case "profile6":
            return '/assets/images/profile/profile7.svg';
        case "profile7":
            return '/assets/images/profile/profile8.svg';
        default:
            return '/assets/images/profile/profile1.svg';
    };
};

export function setPositionImg(position: number) {
    //TODO: api 작업 시 수정
    switch (position) {
        case 1:
            return '/assets/icons/position_top_purple.svg';
        case 2:
            return '/assets/icons/position_jungle_purple.svg';
        case 3:
            return '/assets/icons/position_mid_purple.svg';
        case 4:
            return '/assets/icons/position_one_deal_purple.svg';
        case 5:
            return '/assets/icons/position_supporter_purple.svg';
        default:
            return '/assets/icons/position_top_purple.svg';
    };
};

export function setTierImg(tier: number) {
    //TODO: api 작업 시 수정
    switch (tier) {
        case 0:
            return '/assets/icons/tier_bronze.svg';
        case 1:
            return '/assets/icons/tier_diamond.svg';
        case 2:
            return '/assets/icons/tier_gold.svg';
        case 3:
            return '/assets/icons/tier_bronze.svg';
        case 4:
            return '/assets/icons/tier_gold.svg';
        case 4:
            return '/assets/icons/tier_bronze.svg';
        default:
            return '/assets/icons/tier_diamond.svg';
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

export function setPostingDateFormatter(date:string) {
    return dayjs(date).format('YYYY.MM.DD hh:mm');
};