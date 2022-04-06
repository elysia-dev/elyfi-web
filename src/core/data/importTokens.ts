import MainnetType from 'src/enums/MainnetType';
import envs from 'src/core/envs';
import elfi from 'src/assets/images/ELFI.png';

type MainnetTokenAddress = {
  [mainnet in MainnetType]: {
    address: string;
  };
};
export interface IImportTokens {
  symbol: string;
  image: string;
  decimals: number;
  mainnet: MainnetTokenAddress;
}

export const ImportTokenData: IImportTokens[] = [
  {
    symbol: 'ELFI',
    image: elfi,
    decimals: 18,
    mainnet: {
      [MainnetType.Ethereum]: {
        address: envs.token.governanceAddress,
      },
      [MainnetType.BSC]: {
        address: envs.token.bscElfiAddress,
      },
    },
  },
  {
    symbol: 'sELFI',
    image: elfi,
    decimals: 18,
    mainnet: {
      [MainnetType.Ethereum]: {
        address: envs.staking.elfyV2StakingPoolAddress,
      },
      [MainnetType.BSC]: {
        address: envs.staking.elfyBscStakingPoolAddress,
      },
    },
  },
];
