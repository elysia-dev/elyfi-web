import el from 'src/assets/images/el.png';
import eth from 'src/assets/images/eth.png';
import dai from 'src/assets/images/dai.png';
import usdc from 'src/assets/images/USDC.png';
import usdt from 'src/assets/images/usdt.png';
import envs from 'src/core/envs';

export interface IReserve {
  name: string;
  image: string;
  decimals: number;
  address: string;
  tokeninzer?: string;
}

export const reserveTokenData = {
  DAI: {
    name: 'DAI',
    image: dai,
    decimals: 18,
    address: envs.daiAddress,
    tokeninzer: envs.daiTokenizerAddress,
  },
  USDT: {
    name: 'USDT',
    image: usdt,
    decimals: 6,
    address: envs.usdtAddress,
    tokeninzer: envs.usdtTokeninzerAddress,
  },
  EL: {
    name: 'EL',
    image: el,
    decimals: 18,
    address: envs.elAddress,
  },
  ETH: {
    name: 'ETH',
    image: eth,
    decimals: 18,
    address: '0x',
  },
  USDC: {
    name: 'USDC',
    image: usdc,
    decimals: 6,
    address: '0x',
  },
};

const reserves: IReserve[] = [
  {
    name: 'USDT',
    image: usdt,
    decimals: 6,
    address: envs.usdtAddress,
    tokeninzer: envs.usdtTokeninzerAddress,
  },
  {
    name: 'DAI',
    image: dai,
    decimals: 18,
    address: envs.daiAddress,
    tokeninzer: envs.daiTokenizerAddress,
  },
  {
    name: 'EL',
    image: el,
    decimals: 18,
    address: envs.elAddress,
  },
  {
    name: 'ETH',
    image: eth,
    decimals: 18,
    address: '0x',
  },
  {
    name: 'USDC',
    image: usdc,
    decimals: 6,
    address: '0x',
  },
];

export default reserves;
