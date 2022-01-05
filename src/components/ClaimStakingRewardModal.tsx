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
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import RoundData from 'src/core/types/RoundData';
import CountUp from 'react-countup';
import { formatEther } from '@ethersproject/units';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import ModalHeader from './ModalHeader';

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
  endedBalance,
  currentRound,
  round,
  closeHandler,
  afterTx,
  transactionModal,
}) => {
  const { account } = useWeb3React();
  const stakingPool = useStakingPool(stakedToken, round >= 3);
  const { waiting } = useWatingTx();
  const { t } = useTranslation();
  const { setTransaction, failTransaction } = useContext(TxContext);

  return (
    <div
      className="modal modal__incentive"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          image={token === Token.ELFI ? ElifyTokenImage : DaiImage}
          title={token}
          onClose={closeHandler}
        />
        <div className="modal__body">
          {waiting ? (
            <LoadingIndicator />
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
              <div
                className="modal__button"
                onClick={() => {
                  if (!account) return;

                  const emitter = buildEventEmitter(
                    'ClaimStakingRewardModal',
                    'Claim',
                    `${utils.formatEther(
                      (balance?.value || endedBalance)!,
                    )} ${stakedToken} ${round}round`,
                  );

                  emitter.clicked();

                  // TRICKY
                  // ELFI V2 StakingPool need round - 2 value
                  stakingPool
                    ?.claim(
                      (round >= 3 && stakedToken === Token.ELFI
                        ? round - 2
                        : round
                      ).toString(),
                    )
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimStakingRewardModal;
