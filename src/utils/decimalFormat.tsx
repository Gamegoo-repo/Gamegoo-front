export const formatDecimal = (num: number | string, fixed = 1) =>
  Number(num).toFixed(fixed);
