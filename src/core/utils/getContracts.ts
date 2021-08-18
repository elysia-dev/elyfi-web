import ERC20Abi from 'src/core/abis/ERC20.json';
import ERC20TestAbi from 'src/core/abis/ERC20Test.json';
import getProviderOrSigner from './getSignerOrProvider';
import { Contract, constants, utils, providers } from 'ethers';

export function isAddress(value: any): string | false {
  try {
    return utils.getAddress(value);
  } catch {
    return false;
  }
}

function getContract(address: string, ABI: any, library: providers.Web3Provider): Contract {
  if (!isAddress(address) || address === constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library) as any);
}

export function getERC20(address: string, library: providers.Web3Provider): Contract | null {
  return getContract(
    address,
    ERC20Abi,
    library
  )
}

export function getERC20Test(address: string, library: providers.Web3Provider): Contract | null {
  return getContract(
    address,
    ERC20TestAbi,
    library
  )
}

export default getContract;