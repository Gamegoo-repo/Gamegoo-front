export const getProfileBgColor = (id: number) => {
  const colors = [
    "#DFDEFF",
    "#FAF9FF",
    "#9F90F9",
    "#FAF9FF",
    "#191B1E",
    "#9F90F9",
    "#FAF9FF",
    "#DFDEFF",
  ];
  return colors[(id - 1) % colors.length];
};
