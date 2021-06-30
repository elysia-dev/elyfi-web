import el from 'src/assets/images/el.png';
import eth from 'src/assets/images/eth.png';
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
    name: "EL",
    image: el,
  },
  {
    name: "ETH",
    image: eth
  },
  {
    name: "USDT",
    image: usdt,
  },
]

export default reserves