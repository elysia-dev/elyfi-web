import ETH from 'src/assets/images/navigation__eth.png';
import BSC from 'src/assets/images/navigation__bsc.png';
import MainnetType from 'src/enums/MainnetType';
import envs from '../envs';

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

export interface IMainnetList {
  name: string,
  image: string,
  chainId: number,
  type: MainnetType
}

export const MainnetList: IMainnetList[] = [
  {
    name: "Ethereum",
    image: ETH,
    chainId: envs.requiredChainId,
    type: MainnetType.Ethereum
  },
  {
    name: "BSC",
    image: BSC,
    chainId: envs.bscMainnetChainId,
    type: MainnetType.BSC
  }
]

export const MainnetData = {
  [MainnetType.Ethereum]: {
    name: "Ethereum",
    image: ETH,
    chainId: envs.requiredChainId
  },
  [MainnetType.BSC]: {
    name: "BSC",
    image: BSC,
    chainId: envs.bscMainnetChainId
  }
}

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
    symbol: "Ethereum",
    type: MainnetType.Ethereum,
    name: "Ropsten",
    image: ETH,
    chainId: 3,
    chainHexId: "0x3",
    addParams: {
      chainId: "0x3",
      chainName: "Ropsten Mainnet",
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://ropsten.etherscan.io/'],
      rpcUrls: ['https://ropsten.infura.io/v3/undefined'],
    }
  },
  {
    symbol: "Ethereum",
    type: MainnetType.Ethereum,
    name: "Rinkeby",
    image: ETH,
    chainId: 4,
    chainHexId: "0x4",
    addParams: {
      chainId: "0x4",
      chainName: "Rinkeby Mainnet",
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
      rpcUrls: ['https://rinkeby.infura.io/v3/undefined'],
    }
  },
  {
    symbol: "Ethereum",
    type: MainnetType.Ethereum,
    name: "Goerli",
    image: ETH,
    chainId: 5,
    chainHexId: "0x5",
    addParams: {
      chainId: "0x5",
      chainName: "Goerli Mainnet",
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://goerli.etherscan.io/'],
      rpcUrls: ['https://goerli.infura.io/v3/undefined'],
    }
  },
  {
    symbol: "Ethereum",
    type: MainnetType.Ethereum,
    name: "Kovan",
    image: ETH,
    chainId: 42,
    chainHexId: "0x2a",
    addParams: {
      chainId: "0x2a",
      chainName: "Kovan Mainnet",
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://kovan.etherscan.io/'],
      rpcUrls: ['https://Kovan.infura.io/v3/undefined'],
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
    name: "BSC",
    image: BSC,
    chainId: 56,
    chainHexId: "0x38",
    addParams: {
      chainId: "0x38",
      chainName: "Binance Smart Chain",
      nativeCurrency: {
        name: "Binance",
        symbol: "BNB",
        decimals: 18
      },
      blockExplorerUrls: ['https://bscscan.com'],
      rpcUrls: ['https://bsc-dataseed.binance.org'],
    }
  },
  {
    symbol: "BSC",
    type: MainnetType.BSC,
    name: "BSC Test",
    image: BSC,
    chainId: 97,
    chainHexId: "0x61",
    addParams: {
      chainId: "0x61",
      chainName: "BSC Testnet",
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