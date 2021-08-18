import { BigNumber, constants, providers } from "ethers";
import { getERC20, getERC20Test } from "src/core/utils/getContracts";
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
      .approve(envs.moneyPoolAddress, constants.MaxUint256);

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

export const getErc20Balance = async (address: string, account: string, library: providers.Web3Provider): Promise<BigNumber> => {
  const contract = getERC20(address, library);

  if (!contract) return constants.Zero;

  return await contract.balanceOf(account) as BigNumber
}

export const faucetTestERC20 = async (account: string, library: providers.Web3Provider): Promise<string | undefined> => {
  const contract = getERC20Test(envs.testStableAddress, library);
  const request = library.provider.request;

  if (!contract || !request) return;

  try {
    const populatedTransaction = await contract?.populateTransaction.faucet();

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