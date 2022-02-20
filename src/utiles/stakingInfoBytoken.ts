const miningValueByToken = (token: string, round: number): number => {
  switch (token) {
    case 'EL':
      return 5000000;
    case 'ELFI':
      return round > 1 ? 50000 : 25000;
    case 'BUSD':
      return round > 0 ? 50000 : 12500;
    default:
      return 0;
  }
};

export const countValue = (
  start: number | number[],
  end: number | number[],
  idx: number,
): {
  start: number;
  end: number;
} => {
  return {
    start: typeof start === 'number' ? start : start[idx],
    end: typeof end === 'number' ? end : end[idx],
  };
};

export default miningValueByToken;
