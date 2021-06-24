import { BigNumber, constants, providers } from "ethers";
import { getERC20 } from "src/core/utils/getContracts";

// FIXME : make environment variable
const moneypool = '0xda6C572b830C6471EcEb001e8D04279101457783'

export const getAllowance = async (account: string, contractAddress: string, library: providers.Web3Provider): Promise<BigNumber> => {
  const contract = getERC20(contractAddress, library);

  if (!contract) return constants.Zero;

  return await contract.allowance(account, moneypool) as BigNumber;
}

export const increaseAllownace = async (account: string, contractAddress: string, library: providers.Web3Provider): Promise<string | undefined> => {
  const contract = getERC20(contractAddress, library);

  if (!contract) return;

  const request = library.provider.request;

  if (!request) return;

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


