export const getProfileBgColor = (id: number | null) => {
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
  if (id === null) return colors[0];
  else return colors[(id - 1) % colors.length];
};
