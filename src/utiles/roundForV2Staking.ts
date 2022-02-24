import Token from 'src/enums/Token';

export const roundForV2ElfiStaking = (
  round: number,
  stakedToken: string,
  mainnet: string,
): number => {
  return round >= 3 && stakedToken === Token.ELFI && mainnet === 'Ethereum'
    ? round - 2
    : round;
};
