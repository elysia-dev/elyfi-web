import { providers } from 'ethers'

export default function getLibrary(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider, 'any')
  library.pollingInterval = 15000
  return library
}