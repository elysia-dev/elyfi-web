import ETH from 'src/assets/images/navigation__eth.png';
import BSC from 'src/assets/images/navigation__bsc.png';
import MainnetType from 'src/enums/MainnetType';

export interface IMainnetTypes {
  type: MainnetType,
  name: string,
  image: string
}
export interface IMainnet {
  symbol: string,
  type: MainnetType,
  name: string,
  image: string,
  chainId: number,
  chainHexId: string,
  addParams: {
    chainId: string,
    chainName: string,
    nativeCurrency: {
      name: string,
      symbol: string,
      decimals: number
    },
    blockExplorerUrls: string[],
    rpcUrls: string[]
  }
}

export const mainnetTypes: IMainnetTypes[] = [
  {
    type: MainnetType.Ethereum,
    name: "Ethereum",
    image: ETH
  },
  {
    type: MainnetType.BSC,
    name: "BSC",
    image: BSC
  }
]

export const mainnets: IMainnet[] = [
  {
    symbol: "Ethereum",
    type: MainnetType.Ethereum,
    name: "Ethereum",
    image: ETH,
    chainId: 1,
    chainHexId: "0x1",
    addParams: {
      chainId: "0x1",
      chainName: "Ethereum Mainnet",
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://etherscan.io'],
      rpcUrls: ['https://mainnet.infura.io/v3/undefined'],
    }
  },
  {
    symbol: "Ethereum(G)",
    type: MainnetType.Ethereum,
    name: "Ganache",
    image: ETH,
    chainId: 1337,
    chainHexId: "0x1",
    addParams: {
      chainId: "0x1",
      chainName: "Ganache Mainnet",
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://etherscan.io'],
      rpcUrls: ['https://mainnet.infura.io/v3/undefined'],
    }
  },
  // {
  //   symbol: "Ethereum(G)",
  //   type: MainnetType.Ethereum,
  //   name: "Ganache",
  //   image: ETH,
  //   chainId: 1337,
  //   chainHexId: "0x539",
  //   addParams: {
  //     chainId: "0x539",
  //     chainName: "Ganache Mainnet",
  //     nativeCurrency: {
  //       name: 'Ethereum',
  //       symbol: 'ETH',
  //       decimals: 18,
  //     },
  //     blockExplorerUrls: ['https://etherscan.io'],
  //     rpcUrls: ['https://mainnet.infura.io/v3/undefined'],
  //   }
  // },
  {
    symbol: "BSC",
    type: MainnetType.BSC,
    name: "BSC Test",
    image: BSC,
    chainId: 97,
    chainHexId: "0x61",
    addParams: {
      chainId: "0x61",
      chainName: "BSC Mainnet 테스트!",
      nativeCurrency: {
        name: "Binance",
        symbol: "BNB",
        decimals: 18
      },
      blockExplorerUrls: ['https://explorer.binance.org/smart-testnet'],
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    }
  }
]