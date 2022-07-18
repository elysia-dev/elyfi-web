import { useWeb3React } from '@web3-react/core';
import { constants, utils } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { useContext, useEffect, useState } from 'react';
import { Controller } from 'src/abis/types';
import { getControllerContract } from 'src/clients/BalancesFetcher';
import TxContext from 'src/contexts/TxContext';
import envs from 'src/core/envs';
import ElyfiVersions from 'src/enums/ElyfiVersions';
import ModalViewType from 'src/enums/ModalViewType';
import NFTPurchaseType from 'src/enums/NFTPurchaseType';
import RecentActivityType from 'src/enums/RecentActivityType';
import TransactionType from 'src/enums/TransactionType';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
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
  isApprove: boolean;
  approve: () => Promise<void>;
  isLoading: boolean;
} => {
  const { account, library, chainId } = useWeb3React();
  const { setTransaction, failTransaction, txStatus, txType } =
    useContext(TxContext);
  const ercContract = useERC20(envs.token.usdcAddress);
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const purchaseNFT = async (
    amount: string,
    purchaseType: string,
    modalClose: () => void,
    ethAmount?: string,
  ) => {
    if (!account) throw Error('No account');
    setIsLoading(true);
    const controllerContract: Controller = getControllerContract(
      library.getSigner(),
    );

    const emitter = buildEventEmitter(
      ModalViewType.NFTPurchaseModal,
      TransactionType.PurchaseNFT,
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
        RecentActivityType.PurchasedNFT,
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

  const checkAllowance = async (account: string) => {
    const allowanceAmount = await ercContract.allowance(
      account,
      '0xaA9ee17a1aC1658426B61cD5d501c4b00CDC1eD5',
    );
    console.log(
      'allowance',
      allowanceAmount.gte(parseEther(String(usdc))),
      parseEther(String(usdc)),
    );

    return allowanceAmount.gte(parseEther(String(usdc)));
  };

  const approve = async () => {
    setIsLoading(true);
    const emitter = buildEventEmitter(
      ModalViewType.NFTPurchaseModal,
      TransactionType.Approve,
      JSON.stringify({
        version: ElyfiVersions.V1,
        chainId,
        address: account,
      }),
    );

    try {
      emitter.clicked();

      const tx = await ercContract.approve(
        '0xaA9ee17a1aC1658426B61cD5d501c4b00CDC1eD5',
        constants.MaxUint256,
      );
      setTransaction(
        tx,
        emitter,
        RecentActivityType.Approve,
        () => {},
        () => {},
      );
    } catch (error) {
      failTransaction(emitter, () => {}, error, TransactionType.Approve);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!account) return;

    (async () => {
      setIsApprove(await checkAllowance(account));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (account && txType === RecentActivityType.Approve) {
        setIsApprove(await checkAllowance(account));
      }
      if (txStatus === 'CONFIRM') {
        setIsLoading(false);
      }
    })();
  }, [txStatus]);

  return { purchaseNFT, isApprove, approve, isLoading };
};

export default usePurchaseNFT;
