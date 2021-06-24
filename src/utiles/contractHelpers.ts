import { BigNumber, constants, providers } from "ethers";
import { getERC20, getMoneyPool } from "src/core/utils/getContracts";

// FIXME : make environment variable
const moneypool = '0xda6C572b830C6471EcEb001e8D04279101457783'

export const getAllowance = async (account: string, contractAddress: string, library: providers.Web3Provider): Promise<BigNumber> => {
  const contract = getERC20(contractAddress, library);

  if (!contract) return constants.Zero;

  return await contract.allowance(account, moneypool) as BigNumber;
}

export const increaseAllownace = async (account: string, contractAddress: string, library: providers.Web3Provider): Promise<string | undefined> => {
  const contract = getERC20(contractAddress, library);
  const request = library.provider.request;

  if (!contract || !request) return;

  try {
    const populatedTransaction = await contract?.populateTransaction
      .approve(moneypool, '9' + '0'.repeat(32))

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
  const contract = getMoneyPool(moneypool, library);
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