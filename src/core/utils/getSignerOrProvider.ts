import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'

function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? library.getSigner(account).connectUnchecked() : library
}

export default getProviderOrSigner