import { BigNumber, constants, utils } from 'ethers';
import { useState, useContext, useMemo } from 'react';
import ELFI from 'src/assets/images/ELFI.png';
import { formatComma } from 'src/utiles/formatters';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import Token from 'src/enums/Token';
import ArrowUp from 'src/assets/images/arrow-up.png';
import ArrowDown from 'src/assets/images/arrow-down.png';
import ArrowLeft from 'src/assets/images/arrow-left.png';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import moment from 'moment';
import useStakingPool from 'src/hooks/useStakingPool';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import { formatEther, parseEther } from 'ethers/lib/utils';
import useWaitingTx from 'src/hooks/useWaitingTx';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import ModalViewType from 'src/enums/ModalViewType';
import TransactionType from 'src/enums/TransactionType';
import ElyfiVersions from 'src/enums/ElyfiVersions';
import LoadingIndicator from './LoadingIndicator';
import ModalHeader from './ModalHeader';
import Popupinfo from './PopupInfo';

const MigrationModal: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
  afterTx: () => void;
  stakedToken: Token.ELFI | Token.EL;
  rewardToken: Token.ELFI | Token.DAI;
  stakedBalance: BigNumber;
  rewardBalance: BigNumber;
  round: number;
  transactionModal: () => void;
}> = ({
  visible,
  closeHandler,
  afterTx,
  stakedBalance,
  rewardBalance,
  stakedToken,
  rewardToken,
  round,
  transactionModal,
}) => {
  const current = moment();
  const { t, i18n } = useTranslation();
  const { account, chainId } = useWeb3React();
  const [state, setState] = useState({
    withdrawAmount: '',
    migrationAmount: '',
    withdrawMax: false,
    migrationMax: false,
  });
  const [mouseHover, setMouseHover] = useState(false);
  const stakingPool = useStakingPool(stakedToken, round >= 3);
  const { waiting, wait } = useWaitingTx();
  const { setTransaction, failTransaction } = useContext(TxContext);

  const amountGtStakedBalance =
    !state.withdrawMax &&
    utils.parseEther(state.withdrawAmount || '0').gt(stakedBalance);
  const migrationAmountGtStakedBalance =
    !state.migrationMax &&
    utils.parseEther(state.migrationAmount || '0').gt(stakedBalance);

  const currentRound = useMemo(() => {
    return stakingRoundTimes.filter(
      (round) => current.diff(round.startedAt) >= 0,
    ).length;
  }, [current]);

  return (
    <div className="modal" style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          title={stakedToken}
          image={ELFI}
          onClose={() => closeHandler()}
        />
        {waiting ? (
          <LoadingIndicator />
        ) : (
          <div className="modal__migration">
            <div className="modal__migration__wrapper">
              <div>
                <h2>{t('staking.unstaking')}</h2>
                <div className="modal__migration__input">
                  <h2
                    className="modal__input__maximum"
                    onClick={() => {
                      setState({
                        migrationAmount: '0',
                        migrationMax: false,
                        withdrawAmount: Math.floor(
                          parseFloat(utils.formatEther(stakedBalance)),
                        ).toFixed(8),
                        withdrawMax: true,
                      });
                    }}>
                    {t('staking.max')}
                  </h2>
                  <h2 className="modal__input__value">
                    <input
                      type="number"
                      className="modal__input__value__amount"
                      placeholder="0"
                      value={state.withdrawAmount}
                      style={{
                        fontSize:
                          state.withdrawAmount.length < 8
                            ? 40
                            : state.withdrawAmount.length > 12
                            ? 40
                            : 40,
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        ['-', '+', 'e'].includes(e.key) && e.preventDefault();
                      }}
                      onChange={({ target }) => {
                        target.value = target.value.replace(
                          /(\.\d{18})\d+/g,
                          '$1',
                        );

                        if (target.value) {
                          setState({
                            withdrawAmount: target.value,
                            migrationAmount: formatEther(
                              stakedBalance.sub(parseEther(target.value)),
                            ),
                            withdrawMax: false,
                            migrationMax: false,
                          });
                        } else {
                          setState({
                            migrationAmount: '',
                            withdrawAmount: '',
                            withdrawMax: false,
                            migrationMax: false,
                          });
                        }
                      }}
                    />
                  </h2>
                </div>
              </div>
              <div className="arrow-wrapper">
                <img src={ArrowUp} />
                <img src={ArrowDown} />
              </div>
              <div>
                <div className="modal__migration__popup__info">
                  <h2>{t('staking.migration')}</h2>
                  <Popupinfo content={t('staking.migration--content')} />
                </div>
                <div className="modal__migration__input">
                  <h2
                    className="modal__input__maximum"
                    onClick={() => {
                      setState({
                        withdrawAmount: '0',
                        withdrawMax: false,
                        migrationAmount: Math.floor(
                          parseFloat(utils.formatEther(stakedBalance)),
                        ).toFixed(8),
                        migrationMax: true,
                      });
                    }}>
                    {t('staking.max')}
                  </h2>
                  <h2 className="modal__input__value">
                    <input
                      type="number"
                      className="modal__input__value__amount"
                      placeholder="0"
                      value={state.migrationAmount}
                      style={{
                        fontSize:
                          state.migrationAmount.length < 8
                            ? 40
                            : state.migrationAmount.length > 12
                            ? 40
                            : 40,
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        ['-', '+', 'e'].includes(e.key) && e.preventDefault();
                      }}
                      onChange={({ target }) => {
                        target.value = target.value.replace(
                          /(\.\d{18})\d+/g,
                          '$1',
                        );

                        if (target.value) {
                          setState({
                            migrationAmount: target.value,
                            withdrawAmount: formatEther(
                              stakedBalance.sub(parseEther(target.value)),
                            ),
                            withdrawMax: false,
                            migrationMax: false,
                          });
                        } else {
                          setState({
                            migrationAmount: '',
                            withdrawAmount: '',
                            withdrawMax: false,
                            migrationMax: false,
                          });
                        }
                      }}
                    />
                  </h2>
                </div>
                <div className="modal__migration__nth">
                  <p>{t('staking.migration_location')} : </p>
                  <p>
                    {t('staking.nth', {
                      nth: toOrdinalNumber(i18n.language, round),
                    })}
                  </p>
                  <img src={ArrowLeft} />
                  <p>
                    {t('staking.nth', {
                      nth: toOrdinalNumber(i18n.language, currentRound),
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal__migration__content">
              <p>{t('staking.available_amount')}</p>
              <div>
                <h2>
                  {t('staking.nth_staking_amount', {
                    nth: toOrdinalNumber(i18n.language, round),
                  })}
                </h2>
                <h2>{`${formatComma(stakedBalance)} ${stakedToken}`}</h2>
              </div>
              <p>{t('staking.reward_token_claim')}</p>
              <div>
                <h2>
                  {t('staking.nth_reward_amount', {
                    nth: toOrdinalNumber(i18n.language, round),
                  })}
                </h2>
                <h2>{`${formatComma(rewardBalance)} ${rewardToken}`}</h2>
              </div>
            </div>
          </div>
        )}
        <div
          className={`modal__button${
            stakedBalance.isZero() ||
            amountGtStakedBalance ||
            migrationAmountGtStakedBalance
              ? ' disable'
              : ''
          }`}
          onClick={() => {
            if (
              stakedBalance.isZero() ||
              !account ||
              amountGtStakedBalance ||
              migrationAmountGtStakedBalance
            )
              return;

            const emitter = buildEventEmitter(
              ModalViewType.MigrationOrUnstakingModal,
              TransactionType.Migrate,
              JSON.stringify({
                version: ElyfiVersions.V1,
                chainId,
                address: account,
                stakingType: stakedToken,
                round,
                migrationAmount: utils.formatEther(
                  state.migrationAmount || '0',
                ),
                unstakingAmount: utils.formatEther(state.withdrawAmount || '0'),
                incentiveAmount: utils.formatEther(rewardBalance),
              }),
            );

            emitter.clicked();

            // TRICKY
            // ELFI V2 StakingPool need round - 2 value
            stakingPool
              ?.migrate(
                state.migrationMax
                  ? stakedBalance
                  : state.withdrawMax
                  ? constants.Zero
                  : utils.parseEther(state.migrationAmount),
                (round >= 3 && stakedToken === Token.ELFI
                  ? round - 2
                  : round
                ).toString(),
              )
              .then((tx) => {
                setTransaction(
                  tx,
                  emitter,
                  (stakedToken + 'Migration') as RecentActivityType,
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
                console.error(e);
                failTransaction(emitter, closeHandler, e);
              });
          }}>
          <p>
            {amountGtStakedBalance
              ? t('staking.insufficient_balance')
              : t('staking.transfer')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MigrationModal;
