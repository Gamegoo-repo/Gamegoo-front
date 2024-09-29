export const getProfileBgColor = (id: number) => {
  const colors = [
    "#CBC3FF",
    "#D5CEFF",
    "#9F90F9",
    "#3F3F3F",
    "#3F3F3F",
    "#9F90F9",
    "#DBD5FF",
    "#9F90F9",
  ];
  return colors[(id - 1) % colors.length];
};
