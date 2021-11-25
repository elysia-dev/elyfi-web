const isLat = (num: number): boolean =>
  Number.isFinite(num) && Math.abs(num) <= 90;

export default isLat;
