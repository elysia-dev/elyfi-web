import el from 'src/assets/images/el.png';
import eth from 'src/assets/images/eth.png';
import dai from 'src/assets/images/dai.png';
import usdc from 'src/assets/images/USDC.png';
import usdt from 'src/assets/images/usdt.png';
import busd from 'src/assets/images/busd.png';
import envs from 'src/core/envs';

export interface IReserve {
  name: string;
  image: string;
  decimals: number;
  address: string;
  tokenizer?: string;
}

export const reserveTokenData = {
  DAI: {
    name: 'DAI',
    image: dai,
    decimals: 18,
    address: envs.token.daiAddress,
    tokenizer: envs.tokenizer.daiTokenizerAddress,
  },
  USDT: {
    name: 'USDT',
    image: usdt,
    decimals: 6,
    address: envs.token.usdtAddress,
    tokenizer: envs.tokenizer.usdtTokenizerAddress,
  },
  EL: {
    name: 'EL',
    image: el,
    decimals: 18,
    address: envs.token.elAddress,
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
  BUSD: {
    name: 'BUSD',
    image: busd,
    decimals: 18,
    address: envs.token.busdAddress,
    tokenizer: envs.tokenizer.busdTokenizerAddress,
  },
};

const reserves: IReserve[] = [
  {
    name: 'USDT',
    image: usdt,
    decimals: 6,
    address: envs.token.usdtAddress,
    tokenizer: envs.tokenizer.usdtTokenizerAddress,
  },
  {
    name: 'DAI',
    image: dai,
    decimals: 18,
    address: envs.token.daiAddress,
    tokenizer: envs.tokenizer.daiTokenizerAddress,
  },
  {
    name: 'EL',
    image: el,
    decimals: 18,
    address: envs.token.elAddress,
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
  {
    name: 'BUSD',
    image: busd,
    decimals: 18,
    address: envs.token.busdAddress,
    tokenizer: envs.tokenizer.busdTokenizerAddress,
  },
];

export default reserves;
