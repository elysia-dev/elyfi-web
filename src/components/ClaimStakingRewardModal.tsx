import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { FunctionComponent, useContext } from 'react';
import LoadingIndicator from 'src/components/LoadingIndicator';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import DaiImage from 'src/assets/images/dai.png';
import { formatCommaSmall, formatSixFracionDigit } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import useStakingPool from 'src/hooks/useStakingPool';
import useWatingTx from 'src/hooks/useWaitingTx';
import useTxTracking from 'src/hooks/useTxTracking';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import CountUp from 'react-countup';
import { formatEther } from 'ethers/lib/utils';
import RoundData from 'src/core/types/RoundData';

const ClaimStakingRewardModal: FunctionComponent<{
  stakedToken: Token.ELFI | Token.EL;
  token: Token.ELFI | Token.DAI;
  balance?: {
    before: BigNumber;
    value: BigNumber;
  };
  endedBalance: BigNumber;
  currentRound: RoundData;
  visible: boolean;
  round: number;
  closeHandler: () => void;
  afterTx: () => void;
  transactionModal: () => void;
}> = ({
  visible,
  stakedToken,
  token,
  balance,
  round,
  closeHandler,
  afterTx,
  transactionModal,
  endedBalance,
  currentRound,
}) => {
  const { account } = useWeb3React();
  const stakingPool = useStakingPool(stakedToken, round >= 3);
  const { waiting } = useWatingTx();
  const { t } = useTranslation();
  const initTxTracker = useTxTracking();
  const { setTransaction, failTransaction } = useContext(TxContext);

  return (
    <div
      className="modal modal--deposit"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img
              className="modal__header__image"
              src={token === Token.ELFI ? ElifyTokenImage : DaiImage}
              alt="Token"
            />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name bold">{token}</p>
            </div>
          </div>
          <div className="close-button" onClick={closeHandler}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="modal__body">
          {waiting ? (
            <LoadingIndicator />
          ) : (
            <div className="modal__withdraw">
              <div className="modal__withdraw__value-wrapper">
                <p></p>
                <p
                  className="modal__withdraw__value bold"
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
              <div
                className="modal__button"
                onClick={() => {
                  if (!account) return;

                  const tracker = initTxTracker(
                    'ClaimStakingRewardModal',
                    'Claim',
                    `${utils.formatEther(
                      (balance?.value || endedBalance)!,
                    )} ${stakedToken} ${round}round`,
                  );

                  tracker.clicked();

                  // TRICKY
                  // ELFI V2 StakingPool need round - 2 value
                  stakingPool
                    .claim(
                      (round >= 3 && stakedToken === Token.ELFI
                        ? round - 2
                        : round
                      ).toString(),
                    )
                    .then((tx) => {
                      setTransaction(
                        tx,
                        tracker,
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
                      failTransaction(tracker, closeHandler, e);
                    });
                }}>
                <p>{t('staking.claim_reward')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimStakingRewardModal;
