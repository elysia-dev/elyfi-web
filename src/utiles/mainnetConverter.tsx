const mainnetConverter = (mainnetChainId: number | undefined) => {
  switch (mainnetChainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 3:
      return 'Ropsten Testnet';
    case 4:
      return 'Rinkeby Testnet';
    case 5:
      return 'Goerli Testnet';
    case 42:
      return 'Kovan Testnet';
    case 56:
      return 'Binance Mainnet';
    case 97:
      return 'Binance Testnet';
    case 1337:
      return 'Ganache Testnet';
    default:
      return 'Unknown Mainnet';
  }
};

export default mainnetConverter;
