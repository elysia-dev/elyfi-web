import { BigNumber, constants, providers } from "ethers";
import { getERC20, getIncentivePool, getMoneyPool } from "src/core/utils/getContracts";
import envs from 'src/core/envs';

export const getAllowance = async (account: string, contractAddress: string, library: providers.Web3Provider): Promise<BigNumber> => {
  const contract = getERC20(contractAddress, library);

  if (!contract) return constants.Zero;

  return await contract.allowance(account, envs.moneyPoolAddress) as BigNumber;
}

export const increaseAllownace = async (account: string, contractAddress: string, library: providers.Web3Provider): Promise<string | undefined> => {
  const contract = getERC20(contractAddress, library);
  const request = library.provider.request;

  if (!contract || !request) return;

  try {
    const populatedTransaction = await contract?.populateTransaction
      .approve(envs.moneyPoolAddress, '9' + '0'.repeat(32))

    const txHash = await request({
      method: 'eth_sendTransaction',
      params: [
        {
          to: populatedTransaction.to,
          from: account,
          data: populatedTransaction.data,
        },
      ],
    })

    return txHash;
  } catch (e) {
    console.log(e);
    return
  }
};

export const deposit = async (account: string, asset: string, amount: BigNumber, library: providers.Web3Provider): Promise<string | undefined> => {
  const contract = getMoneyPool(library);
  const request = library.provider.request;

  if (!contract || !request) return;

  try {
    const populatedTransaction = await contract?.populateTransaction
      .deposit(asset, account, amount);

    const txHash = await request({
      method: 'eth_sendTransaction',
      params: [
        {
          to: populatedTransaction.to,
          from: account,
          data: populatedTransaction.data,
        },
      ],
    })

    return txHash;
  } catch (e) {
    console.log(e);
    return
  }
}

export const withdraw = async (account: string, asset: string, amount: BigNumber, library: providers.Web3Provider): Promise<string | undefined> => {
  const contract = getMoneyPool(library);
  const request = library.provider.request;

  if (!contract || !request) return;

  try {
    const populatedTransaction = await contract?.populateTransaction
      .withdraw(asset, account, amount);

    const txHash = await request({
      method: 'eth_sendTransaction',
      params: [
        {
          to: populatedTransaction.to,
          from: account,
          data: populatedTransaction.data,
        },
      ],
    })

    return txHash;
  } catch (e) {
    console.log(e);
    return
  }
}

export const getUserIncentiveReward = async (account: string, library: providers.Web3Provider): Promise<BigNumber> => {
  const contract = getIncentivePool(library);

  if (!contract) return constants.Zero;

  return await contract.getUserIncentiveReward(account) as BigNumber;
}

export const getErc20Balance = async (address: string, account: string, library: providers.Web3Provider): Promise<BigNumber> => {
  const contract = getERC20(address, library);

  if (!contract) return constants.Zero;

  return await contract.balanceOf(account) as BigNumber
}