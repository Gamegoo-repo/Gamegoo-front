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