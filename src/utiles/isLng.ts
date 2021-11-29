const isLng = (num: number): boolean =>
  Number.isFinite(num) && Math.abs(num) <= 180;

export default isLng;
