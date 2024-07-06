import dayjs from "@/libs/dayjs";


export function setPositionImg(position: number) {
    //TODO: api 작업 시 수정
    switch (position) {
        case 0:
            return '/assets/icons/position_top_purple.svg';
        case 1:
            return '/assets/icons/position_jungle_purple.svg';
        case 2:
            return '/assets/icons/position_mid_purple.svg';
        case 3:
            return '/assets/icons/position_bottom_purple.svg';
        case 4:
            return '/assets/icons/position_supporter_purple.svg';
        default:
            return '/assets/icons/position_supporter_purple.svg';
    }
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
    }
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

export function setChatDateFormatter(date: string) {
    return dayjs(date).format('A h:m');
};