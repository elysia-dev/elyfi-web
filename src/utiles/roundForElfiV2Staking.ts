import Token from 'src/enums/Token';

export const roundForElfiV2Staking = (
  round: number,
  stakedToken: string,
  mainnet: string,
): number => {
  return round >= 3 && stakedToken === Token.ELFI && mainnet === 'Ethereum'
    ? round - 2
    : round;
};
