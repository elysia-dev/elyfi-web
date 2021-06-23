import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import ERC20Abi from 'src/core/abis/ERC20.json';
import getProviderOrSigner from './getSignerOrProvider';
import { Web3Provider } from '@ethersproject/providers';

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

function getContract(address: string, ABI: any, library: Web3Provider): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library) as any);
}

export function getERC20(address: string, library: Web3Provider): Contract | null {
  return getContract(
    address,
    ERC20Abi,
    library
  )
}

export default getContract;