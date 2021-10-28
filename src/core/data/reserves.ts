import dai from 'src/assets/images/dai.png';
import usdt from 'src/assets/images/usdt.png';
import envs from 'src/core/envs';

export interface IReserve {
  name: string;
  image: string;
  decimals: number;
  address: string;
}

const reserves: IReserve[] = [
  {
    name: 'DAI',
    image: dai,
    decimals: 18,
    address: envs.daiAddress,
  },
  {
    name: 'USDT',
    image: usdt,
    decimals: 6,
    address: envs.usdtAddress,
  },
];

export default reserves;
