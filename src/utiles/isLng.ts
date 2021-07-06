const isLng = (num: number) => isFinite(num) && Math.abs(num) <= 180;

export default isLng;