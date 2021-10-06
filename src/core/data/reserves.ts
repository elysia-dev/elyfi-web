import dai from 'src/assets/images/dai.png';
import usdt from 'src/assets/images/usdt.png';

interface IReserve {
  name: string
  image: string
}

const reserves: IReserve[] = [
  {
    name: "DAI",
    image: dai,
  },
  {
    name: "USDT",
    image: usdt,
  },
]

export default reserves