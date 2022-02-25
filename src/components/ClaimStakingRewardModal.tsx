import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { FunctionComponent, useContext } from 'react';
import CountUp from 'react-countup';
import { formatEther } from '@ethersproject/units';

import LoadingIndicator from 'src/components/LoadingIndicator';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import DaiImage from 'src/assets/images/dai.png';
import BusdImage from 'src/assets/images/busd@2x.png';
import { formatCommaSmall, formatSixFracionDigit } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import useStakingPool from 'src/hooks/useStakingPool';
import useWatingTx from 'src/hooks/useWaitingTx';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import RoundData from 'src/core/types/RoundData';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import TransactionType from 'src/enums/TransactionType';
import ModalViewType from 'src/enums/ModalViewType';
import ElyfiVersions from 'src/enums/ElyfiVersions';
import MainnetContext from 'src/contexts/MainnetContext';
import { roundForElfiV2Staking } from 'src/utiles/roundForElfiV2Staking';
import MainnetType from 'src/enums/MainnetType';
import TxStatus from 'src/enums/TxStatus';
import ModalHeader from './ModalHeader';

const ClaimStakingRewardModal: FunctionComponent<{
  stakedToken: Token.ELFI | Token.EL;
  token: Token.ELFI | Token.DAI | Token.BUSD;
  balance?: {
    before: BigNumber;
    value: BigNumber;
  };
  endedBalance: BigNumber;
  stakingBalance: BigNumber;
  currentRound: RoundData;
  visible: boolean;
  round: number;
  closeHandler: () => void;
  afterTx: () => void;
  transactionModal: () => void;
  transactionWait: boolean;
  setTransactionWait: () => void;
}> = ({
  visible,
  stakedToken,
  stakingBalance,
  token,
  balance,
  endedBalance,
  currentRound,
  round,
  closeHandler,
  afterTx,
  transactionModal,
  transactionWait,
  setTransactionWait,
}) => {
  const { account, chainId } = useWeb3React();
  const { contract: stakingPool, rewardContractForV2 } = useStakingPool(
    stakedToken,
    round >= 3,
  );

  const { waiting } = useWatingTx();
  const { t } = useTranslation();
  const { setTransaction, failTransaction, txStatus } = useContext(TxContext);
  const { type: mainnet } = useContext(MainnetContext);

  const claimAddress = rewardContractForV2 ? rewardContractForV2 : stakingPool;
  const claimRound = roundForElfiV2Staking(
    round,
    stakedToken,
    mainnet,
  ).toString();

  return (
    <div
      className="modal modal__incentive"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          image={
            token === Token.ELFI
              ? ElifyTokenImage
              : mainnet === MainnetType.BSC
              ? BusdImage
              : DaiImage
          }
          title={token}
          onClose={closeHandler}
        />
        <div className="modal__body">
          {transactionWait || txStatus === TxStatus.PENDING ? (
            <LoadingIndicator isTxActive={transactionWait} />
          ) : (
            <>
              <div className="modal__incentive__body">
                <p
                  className="modal__incentive__value bold"
                  style={{
                    fontSize:
                      window.sessionStorage.getItem('@MediaQuery') !== 'PC'
                        ? 30
                        : 60,
                  }}>
                  {!endedBalance?.isZero()
                    ? formatCommaSmall(endedBalance)
                    : balance && (
                        <CountUp
                          className={`spoqa__bold colored ${
                            token === Token.ELFI ? 'EL' : 'ELFI'
                          }`}
                          start={parseFloat(formatEther(balance.before))}
                          end={parseFloat(
                            formatEther(
                              balance.before.isZero()
                                ? currentRound.accountReward
                                : balance.value,
                            ),
                          )}
                          formattingFn={(number) => {
                            return formatSixFracionDigit(number);
                          }}
                          decimals={6}
                          duration={1}
                        />
                      )}
                </p>
              </div>
            </>
          )}
          <div
            className={`modal__button ${transactionWait ? 'disable' : ''}`}
            onClick={() => {
              transactionWait ? undefined : setTransactionWait();
              if (!account) return;

              const emitter = buildEventEmitter(
                ModalViewType.StakingIncentiveModal,
                TransactionType.Claim,
                JSON.stringify({
                  version: ElyfiVersions.V1,
                  chainId,
                  address: account,
                  stakingType: stakedToken,
                  stakingAmount: utils.formatEther(stakingBalance),
                  incentiveAmount: utils.formatEther(
                    balance?.value || endedBalance,
                  ),
                  round,
                }),
              );

              emitter.clicked();

              // TRICKY
              // ELFI V2 StakingPool need round - 2 value

              claimAddress
                ?.claim(claimRound)
                .then((tx) => {
                  setTransaction(
                    tx,
                    emitter,
                    (stakedToken + 'Claim') as RecentActivityType,
                    () => {
                      transactionModal();
                      closeHandler();
                    },
                    () => {
                      afterTx();
                    },
                  );
                })
                .catch((e) => {
                  failTransaction(emitter, closeHandler, e);
                });
            }}>
            <p>{t('staking.claim_reward')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimStakingRewardModal;
