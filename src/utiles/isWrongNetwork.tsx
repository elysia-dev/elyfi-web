import { isMetamask, isMoblie, isWalletConnector } from './connectWallet';

export const isWrongNetwork = (
  mainnetType: string,
  currentChain?: string,
): boolean => {
  return (
    ((isMetamask() && isMoblie()) || isWalletConnector()) &&
    !(
      (process.env.NODE_ENV === 'development'
        ? currentChain === 'Ganache' || currentChain === 'Ethereum'
          ? 'Ethereum'
          : currentChain === 'BSC Test' || currentChain === 'BSC'
          ? 'BSC'
          : undefined
        : currentChain) === mainnetType
    )
  );
};
