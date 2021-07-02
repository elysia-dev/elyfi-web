import ERC20Abi from 'src/core/abis/ERC20.json';
import MoneyPoolAbi from 'src/core/abis/MoneyPool.json';
import IncentivePoolAbi from 'src/core/abis/IncentivePool.json';
import getProviderOrSigner from './getSignerOrProvider';
import { Contract, constants, utils, providers } from 'ethers';
import envs from 'src/core/envs';

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

export function getMoneyPool(library: providers.Web3Provider): Contract | null {
  return getContract(
    envs.moneyPoolAddress,
    MoneyPoolAbi,
    library
  )
}

export function getIncentivePool(library: providers.Web3Provider): Contract | null {
  return getContract(
    envs.incentivePoolAddress,
    IncentivePoolAbi,
    library
  )
}


export default getContract;