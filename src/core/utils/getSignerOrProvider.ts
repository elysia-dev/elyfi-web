import { providers } from 'ethers';

function getProviderOrSigner(library: providers.Web3Provider, account?: string): providers.Web3Provider | providers.JsonRpcSigner {
  return account ? library.getSigner(account).connectUnchecked() : library
}

export default getProviderOrSigner