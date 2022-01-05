import { BigNumber, constants, logger, utils } from 'ethers';
import { useContext, useState, useEffect } from 'react';
import ELFI from 'src/assets/images/ELFI.png';
import { formatComma } from 'src/utiles/formatters';
import envs from 'src/core/envs';
import { useTranslation } from 'react-i18next';
import useWatingTx from 'src/hooks/useWaitingTx';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { useWeb3React } from '@web3-react/core';
import Token from 'src/enums/Token';
import moment from 'moment';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import useStakingPool from 'src/hooks/useStakingPool';
import useERC20Info from 'src/hooks/useERC20Info';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import txStatus from 'src/enums/TxStatus';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import ModalHeader from 'src/components/ModalHeader';
import ModalConverter from 'src/components/ModalConverter';
import buildEventEmitter from 'src/utiles/buildEventEmitter';

const StakingModal: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
  afterTx: () => void;
  stakedToken: Token.ELFI | Token.EL;
  stakedBalance: BigNumber;
  round: number;
  endedModal: () => void;
  setTxStatus: (status: txStatus) => void;
  setTxWaiting: (status: boolean) => void;
  transactionModal: () => void;
}> = ({
  visible,
  closeHandler,
  afterTx,
  stakedBalance,
  stakedToken,
  round,
  endedModal,
  setTxStatus,
  setTxWaiting,
  transactionModal,
}) => {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const [stakingMode, setStakingMode] = useState<boolean>(true);
  const [amount, setAmount] = useState({ value: '', max: false });
  const current = moment();
  const { setTransaction, failTransaction } = useContext(TxContext);
  const stakingPool = useStakingPool(stakedToken, round >= 3);
  const {
    allowance,
    balance,
    loading: allowanceLoading,
    refetch,
    contract,
  } = useERC20Info(
    stakedToken === Token.EL ? envs.elAddress : envs.governanceAddress,
    stakingPool ? stakingPool.address : '',
  );
  const { waiting, wait } = useWatingTx();
  const amountLteZero =
    !amount.value || utils.parseEther(amount.value || '0').isZero();
  const amountGtBalance =
    !amount.max && utils.parseEther(amount.value || '0').gt(balance);
  const amountGtStakedBalance =
    !amount.max && utils.parseEther(amount.value || '0').gt(stakedBalance);

  useEffect(() => {
    setAmount({
      max: false,
      value: '',
    });
  }, [stakingMode, visible]);

  return (
    <div className="modal" style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          title={stakedToken}
          image={ELFI}
          onClose={() => closeHandler()}
        />
        <ModalConverter
          handlerProps={stakingMode}
          setState={setStakingMode}
          title={[t('staking.staking'), t('staking.unstaking')]}
        />
        {waiting ? (
          <LoadingIndicator />
        ) : (
          <div className="modal__body">
            <div className="modal__input">
              <h2
                className="modal__input__maximum"
                onClick={() => {
                  if (stakingMode ? balance.isZero() : stakedBalance.isZero()) {
                    return;
                  }
                  setAmount({
                    value: Math.floor(
                      parseFloat(
                        utils.formatEther(
                          stakingMode ? balance : stakedBalance,
                        ),
                      ),
                    ).toFixed(8),
                    max: true,
                  });
                }}>
                {t('staking.max')}
              </h2>
              <h2 className="modal__input__value">
                <input
                  type="number"
                  className="modal__input__value__amount"
                  placeholder="0"
                  value={amount.value}
                  style={{
                    fontSize:
                      amount.value.length < 8
                        ? 60
                        : amount.value.length > 12
                        ? 35
                        : 45,
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    ['-', '+', 'e'].includes(e.key) && e.preventDefault();
                  }}
                  onChange={({ target }) => {
                    target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');

                    setAmount({
                      value: target.value,
                      max: false,
                    });
                  }}
                />
              </h2>
            </div>

            <div className="modal__staking__container">
              <p>
                {!stakingMode
                  ? t('staking.available_unstaking_amount')
                  : t('staking.available_staking_amount')}
              </p>
              <div>
                <h2>
                  {stakingMode
                    ? t('staking.wallet_balance')
                    : t('staking.nth_staking_amount', {
                        nth: toOrdinalNumber(i18n.language, round),
                      })}
                </h2>
                <h2>
                  {`${formatComma(
                    stakingMode ? balance : stakedBalance,
                  )} ${stakedToken}`}
                </h2>
              </div>
            </div>

            <section>
              {!stakingMode ? (
                <div
                  className={`modal__button${
                    amountLteZero || amountGtStakedBalance ? ' disable' : ''
                  }`}
                  onClick={() => {
                    if (!account || amountLteZero || amountGtStakedBalance)
                      return;

                    const emitter = buildEventEmitter(
                      'StakingModal',
                      'Withdraw',
                      `${amount.value} ${amount.max} ${stakedToken} ${round}round`,
                    );
                    emitter.clicked();

                    stakingPool
                      ?.withdraw(
                        amount.max
                          ? constants.MaxUint256
                          : utils.parseEther(amount.value),
                        (round >= 3 && stakedToken === Token.ELFI
                          ? round - 2
                          : round
                        ).toString(),
                      )
                      .then((tx) => {
                        setTransaction(
                          tx,
                          emitter,
                          (stakedToken +
                            'StakingWithdraw') as RecentActivityType,
                          () => {
                            closeHandler();
                            transactionModal();
                          },
                          () => {
                            refetch();
                            afterTx();
                          },
                        );
                      })
                      .catch((e) => {
                        failTransaction(emitter, closeHandler, e);
                      });
                  }}>
                  <p>
                    {amountGtStakedBalance
                      ? t('staking.insufficient_balance')
                      : t('staking.unstaking')}
                  </p>
                </div>
              ) : !allowanceLoading && allowance.gte(balance) ? (
                <div
                  className={`modal__button${
                    amountLteZero || amountGtBalance ? ' disable' : ''
                  }`}
                  onClick={() => {
                    if (!account || amountLteZero || amountGtBalance) return;
                    if (
                      current.diff(stakingRoundTimes[round - 1].endedAt) > 0
                    ) {
                      endedModal();
                      closeHandler();
                      return;
                    }

                    const emitter = buildEventEmitter(
                      'StakingModal',
                      `Stake`,
                      `${amount.value} ${amount.max} ${stakedToken} ${round}round`,
                    );

                    emitter.clicked();

                    // setTxWaiting(true)

                    stakingPool
                      ?.stake(
                        amount.max ? balance : utils.parseEther(amount.value),
                        {
                          gasLimit: 1000000,
                        },
                      )
                      .then((tx) => {
                        setTransaction(
                          tx,
                          emitter,
                          (stakedToken + 'Stake') as RecentActivityType,
                          () => {
                            closeHandler();
                            transactionModal();
                          },
                          () => {
                            refetch();
                            afterTx();
                          },
                        );
                      })
                      .catch((e) => {
                        failTransaction(emitter, closeHandler, e);
                      });
                  }}>
                  <p>
                    {amountGtBalance
                      ? t('staking.insufficient_balance')
                      : t('staking.staking')}
                  </p>
                </div>
              ) : (
                <div
                  className={'modal__button'}
                  onClick={() => {
                    const emitter = buildEventEmitter(
                      'StakingModal',
                      `Approve`,
                      `${stakedToken} ${round}round`,
                    );

                    emitter.clicked();

                    contract
                      .approve(stakingPool!.address, constants.MaxUint256)
                      .then((tx) => {
                        setTransaction(
                          tx,
                          emitter,
                          RecentActivityType.Approve,
                          () => {
                            closeHandler();
                            transactionModal();
                          },
                          () => {
                            refetch();
                            afterTx();
                          },
                        );
                      })
                      .catch((e) => {
                        failTransaction(emitter, closeHandler, e);
                      });
                  }}>
                  <p>
                    {t('dashboard.protocol_allow', { tokenName: stakedToken })}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingModal;
