export const getProfileBgColor = (id: number) => {
    const colors = ['#CBC3FF', '#F2F0FF', '#9F90F9', '#F5F4FF', '#3F3F3F', '#9F90F9', '#F2F0FF', '#DBD5FF'];
    return colors[(id - 1) % colors.length];
};