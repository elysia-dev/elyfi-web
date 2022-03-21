import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { FunctionComponent, useContext, useState } from 'react';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import { formatSixFracionDigit } from 'src/utiles/formatters';
import { formatEther } from 'ethers/lib/utils';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import { IncentivePool__factory } from '@elysia-dev/contract-typechain';
import CountUp from 'react-countup';
import ModalHeader from 'src/components/Modal/ModalHeader';
import ModalViewType from 'src/enums/ModalViewType';
import TransactionType from 'src/enums/TransactionType';
import ElyfiVersions from 'src/enums/ElyfiVersions';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from 'src/components/Modal/LoadingIndicator';
import buildEventEmitter from 'src/utiles/buildEventEmitter';

// Create deposit & withdraw
const IncentiveModal: FunctionComponent<{
  balanceBefore: BigNumber;
  balanceAfter: BigNumber;
  visible: boolean;
  incentivePoolAddress: string;
  tokenName: string;
  onClose: () => void;
  afterTx: () => void;
  transactionModal: () => void;
  transactionWait: boolean;
  setTransactionWait: () => void;
}> = ({
  visible,
  balanceBefore,
  balanceAfter,
  incentivePoolAddress,
  tokenName,
  onClose,
  afterTx,
  transactionModal,
  transactionWait,
  setTransactionWait,
}) => {
  const { account, library, chainId } = useWeb3React();
  const { setTransaction, failTransaction } = useContext(TxContext);
  const { t } = useTranslation();

  const reqeustClaimIncentive = async () => {
    setTransactionWait();
    if (!account) return;

    const emitter = buildEventEmitter(
      ModalViewType.IncentiveModal,
      TransactionType.Claim,
      JSON.stringify({
        version: ElyfiVersions.V1,
        chainId,
        address: account,
        moneypoolType: tokenName,
        incentiveAmount: utils.formatEther(balanceAfter),
      }),
    );

    emitter.clicked();
    IncentivePool__factory.connect(incentivePoolAddress, library.getSigner())
      .claimIncentive()
      .then((tx) => {
        emitter.created();
        setTransaction(
          tx,
          emitter,
          RecentActivityType.Claim,
          () => {
            transactionModal();
            onClose();
          },
          () => {
            afterTx();
          },
        );
      })
      .catch((error) => {
        failTransaction(emitter, onClose, error, TransactionType.Claim);
        console.error(error);
      });
  };

  return (
    <div
      className="modal modal__incentive"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader title={'ELFI'} image={ElifyTokenImage} onClose={onClose} />
        <div className="modal__body">
          {transactionWait ? (
            <LoadingIndicator isTxActive={transactionWait} />
          ) : (
            <>
              <div
                className="modal__incentive__body"
                style={{
                  height: 140,
                  overflowY: 'clip',
                }}>
                <CountUp
                  className="modal__incentive__value bold"
                  start={parseFloat(formatEther(balanceBefore))}
                  end={parseFloat(formatEther(balanceAfter))}
                  formattingFn={(number) => {
                    return formatSixFracionDigit(number);
                  }}
                  decimals={6}
                  duration={1}
                />
              </div>
            </>
          )}

          <div
            className={`modal__button ${transactionWait ? 'disable' : ''}`}
            onClick={() => reqeustClaimIncentive()}>
            <p>{'CLAIM REWARD'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncentiveModal;
