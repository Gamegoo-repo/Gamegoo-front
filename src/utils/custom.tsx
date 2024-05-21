export function setPositionImg(position: number) {
    //TODO: api 작업 시 수정
    switch (position) {
        case 0:
            return '/assets/icons/position_supporter_purple.svg';
        case 1:
            return '/assets/icons/position_bot_purple.svg';
        case 2:
            return '/assets/icons/position_bot_purple.svg';
        case 3:
            return '/assets/icons/position_bot_purple.svg';
        case 4:
            return '/assets/icons/position_bot_purple.svg';
        case 4:
            return '/assets/icons/position_bot_purple.svg';
        default:
            return '/assets/icons/position_supporter_purple.svg';
    }
}

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
}