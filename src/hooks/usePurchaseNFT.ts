import { useWeb3React } from '@web3-react/core';
import { constants, utils } from 'ethers';
import { useContext } from 'react';
import { getControllerContract } from 'src/clients/BalancesFetcher';
import TxContext from 'src/contexts/TxContext';
import ElyfiVersions from 'src/enums/ElyfiVersions';
import ModalViewType from 'src/enums/ModalViewType';
import NFTPurchaseType from 'src/enums/NFTPurchaseType';
import RecentActivityType from 'src/enums/RecentActivityType';
import TransactionType from 'src/enums/TransactionType';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import { parseEther } from 'ethers/lib/utils';
import envs from 'src/core/envs';
import useERC20 from './useERC20';

const usePurchaseNFT = (
  usdc: number,
): {
  purchaseNFT: (
    amount: string,
    purchaseType: string,
    modalClose: () => void,
    ethAmount?: string,
  ) => void;
} => {
  const { account, library, chainId } = useWeb3React();
  const { setTransaction, failTransaction } = useContext(TxContext);
  const ercContract = useERC20(envs.token.usdcAddress);

  const purchaseNFT = async (
    amount: string,
    purchaseType: string,
    modalClose: () => void,
    ethAmount?: string,
  ) => {
    if (!account) return;

    const controllerContract = getControllerContract(library.getSigner());

    const emitter = buildEventEmitter(
      ModalViewType.DepositOrWithdrawModal,
      TransactionType.Deposit,
      JSON.stringify({
        version: ElyfiVersions.V1,
        chainId,
        address: account,
        nftPurchaseType: purchaseType,
        depositAmount: utils.parseUnits(
          amount,
          purchaseType === 'ETH' ? 18 : 6,
        ),
      }),
    );
    try {
      emitter.clicked();

      let tx: any;
      if (purchaseType === NFTPurchaseType.ETH) {
        tx = await controllerContract?.deposit(1, utils.parseUnits(amount, 6), {
          value: utils.parseEther(ethAmount || ''),
        });
      }
      if (purchaseType === NFTPurchaseType.USDC) {
        tx = await controllerContract?.deposit(1, utils.parseUnits(amount, 6));
      }
      setTransaction(
        tx,
        emitter,
        RecentActivityType.Deposit,
        () => {
          modalClose();
        },
        () => {},
      );
    } catch (error) {
      failTransaction(
        emitter,
        () => {
          modalClose();
        },
        error,
        TransactionType.PurchaseNFT,
      );
      console.error(error);
    }
  };

  const allowance = async () => {
    if (!account) return;

    const allowanceAmount = await ercContract.allowance(
      account,
      '0xaA9ee17a1aC1658426B61cD5d501c4b00CDC1eD5',
    );

    allowanceAmount.gte(parseEther(String(usdc)));
    const b = await ercContract.approve(
      '0xaA9ee17a1aC1658426B61cD5d501c4b00CDC1eD5',
      constants.MaxUint256,
    );
  };

  return { purchaseNFT };
};

export default usePurchaseNFT;
