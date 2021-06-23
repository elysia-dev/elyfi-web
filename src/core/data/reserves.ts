import el from 'src/assets/images/el.png';
import eth from 'src/assets/images/eth.png';

interface IReserve {
  name: string
  image: string
}

const reserves: IReserve[] = [
  {
    name: "DAI",
    image: el,
  },
  {
    name: "EL",
    image: el,
  },
  {
    name: "ETH",
    image: eth
  }
]

export default reserves