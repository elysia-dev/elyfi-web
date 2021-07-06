const isLat = (num: number) => isFinite(num) && Math.abs(num) <= 90;

export default isLat;