import { BigNumber, constants, utils } from 'ethers';
import { useContext, useState, useEffect } from 'react';
import ELFI from 'src/assets/images/ELFI.png';
import { formatComma } from 'src/utiles/formatters';
import { useTranslation } from 'react-i18next';
import useWatingTx from 'src/hooks/useWaitingTx';
import LoadingIndicator from 'src/components/Modal/LoadingIndicator';
import { useWeb3React } from '@web3-react/core';
import Token from 'src/enums/Token';
import moment from 'moment';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import useStakingPoolV2 from 'src/components/Staking/hooks/useStakingPoolV2';
import useERC20Info from 'src/hooks/useERC20Info';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import ModalHeader from 'src/components/Modal/ModalHeader';
import ModalConverter from 'src/components/Modal/ModalConverter';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import ModalViewType from 'src/enums/ModalViewType';
import TransactionType from 'src/enums/TransactionType';
import ElyfiVersions from 'src/enums/ElyfiVersions';
import { stakingRewardTokenAddressV2 } from 'src/utiles/stakingPoolAddress';
import MainnetContext from 'src/contexts/MainnetContext';
import useCurrentChain from 'src/hooks/useCurrentChain';
import IncreateAllowanceModal, {
  PermissionType,
} from 'src/components/Modal/IncreateAllowanceModal';
import TxStatus from 'src/enums/TxStatus';

const StakingModalV2: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
  afterTx: () => void;
  stakedToken: Token;
  stakedBalance: BigNumber;
  endedModal: () => void;
  transactionModal: () => void;
  transactionWait: boolean;
  setTransactionWait: () => void;
  disableTransactionWait: () => void;
  title: Token | string;
}> = ({
  visible,
  closeHandler,
  afterTx,
  stakedBalance,
  stakedToken,
  endedModal,
  transactionModal,
  transactionWait,
  setTransactionWait,
  disableTransactionWait,
  title,
}) => {
  const { t, i18n } = useTranslation();
  const { account, chainId } = useWeb3React();
  const [stakingMode, setStakingMode] = useState<boolean>(true);
  const [amount, setAmount] = useState({ value: '', max: false });
  const { setTransaction, failTransaction, txStatus } = useContext(TxContext);
  const { contract: stakingPool } = useStakingPoolV2(stakedToken);
  const stakingAddress = stakingPool;
  const { type: getMainnetType } = useContext(MainnetContext);
  const currentChain = useCurrentChain();
  const {
    allowance,
    balance,
    loading: allowanceLoading,
    refetch,
    contract,
  } = useERC20Info(
    stakingRewardTokenAddressV2(
      getMainnetType,
      currentChain?.name,
      stakedToken,
    ),
    stakingAddress ? stakingAddress.address : '',
    visible,
  );

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
          title={title}
          image={ELFI}
          onClose={() => closeHandler()}
          subImage={
            title === Token.ELFI_ETH_LP
              ? eth
              : title === Token.ELFI_DAI_LP
              ? dai
              : undefined
          }
        />
        <ModalConverter
          handlerProps={stakingMode}
          setState={setStakingMode}
          title={[t('staking.staking'), t('staking.unstaking')]}
        />
        {transactionWait ||
        allowanceLoading ||
        (txStatus === TxStatus.PENDING && !allowance.gt(balance)) ? (
          <LoadingIndicator
            isTxActive={transactionWait || txStatus === TxStatus.PENDING}
            button={
              allowanceLoading
                ? t('modal.indicator.permission_check')
                : undefined
            }
            isApproveLoading={
              txStatus === TxStatus.PENDING && !allowance.gt(balance)
            }
          />
        ) : (!allowanceLoading && allowance.gt(balance)) || !stakingMode ? (
          <>
            <div className="modal__body">
              <div className="modal__input">
                <h2
                  className={`modal__input__maximum ${
                    amount.max ? 'is-max' : ''
                  }`}
                  onClick={() => {
                    if (
                      stakingMode ? balance.isZero() : stakedBalance.isZero()
                    ) {
                      return;
                    }
                    setAmount({
                      value: (
                        Math.floor(
                          parseFloat(
                            utils.formatEther(
                              stakingMode ? balance : stakedBalance,
                            ),
                          ) * 10000000,
                        ) / 10000000
                      ).toString(),
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
                      target.value = target.value.replace(
                        /(\.\d{18})\d+/g,
                        '$1',
                      );

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
                      : t('staking.staking_amount')}
                  </h2>
                  <h2>
                    {`${formatComma(
                      stakingMode ? balance : stakedBalance,
                    )} ${stakedToken}`}
                  </h2>
                </div>
              </div>
            </div>
          </>
        ) : (
          <IncreateAllowanceModal
            type={PermissionType.Staking}
            onClick={() => {
              if (transactionWait) return;

              setTransactionWait();

              const emitter = buildEventEmitter(
                ModalViewType.StakingOrUnstakingModal,
                TransactionType.Approve,
                JSON.stringify({
                  version: ElyfiVersions.V1,
                  chainId,
                  address: account,
                  stakingType: stakedToken,
                }),
              );

              emitter.clicked();

              contract
                .approve(stakingAddress!.address, constants.MaxUint256)
                .then((tx) => {
                  setTransaction(
                    tx,
                    emitter,
                    RecentActivityType.Approve,
                    () => {},
                    () => {
                      disableTransactionWait();
                      refetch();
                    },
                  );
                })
                .catch((e) => {
                  failTransaction(
                    emitter,
                    closeHandler,
                    e,
                    TransactionType.Approve,
                  );
                });
            }}
          />
        )}
        <section>
          {!allowanceLoading &&
            (!stakingMode ? (
              <div
                className={`modal__button${
                  amountLteZero || amountGtStakedBalance || transactionWait
                    ? ' disable'
                    : ''
                }`}
                onClick={() => {
                  if (
                    !account ||
                    amountLteZero ||
                    amountGtStakedBalance ||
                    transactionWait
                  )
                    return;

                  setTransactionWait();
                  const emitter = buildEventEmitter(
                    ModalViewType.StakingOrUnstakingModal,
                    TransactionType.Unstake,
                    JSON.stringify({
                      version: ElyfiVersions.V1,
                      chainId,
                      address: account,
                      stakingType: stakedToken,
                      unstakingAmount: utils.formatEther(
                        utils.parseEther(amount.value),
                      ),
                      maxOrNot: amount.max,
                    }),
                  );

                  emitter.clicked();

                  stakingAddress
                    ?.withdraw(
                      amount.max
                        ? constants.MaxUint256
                        : utils.parseEther(amount.value),
                    )
                    .then((tx) => {
                      setTransaction(
                        tx,
                        emitter,
                        (stakedToken + 'StakingWithdraw') as RecentActivityType,
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
                      failTransaction(
                        emitter,
                        closeHandler,
                        e,
                        TransactionType.Unstake,
                      );
                    });
                }}>
                <p>
                  {amountGtStakedBalance
                    ? t('staking.insufficient_balance')
                    : t('staking.unstaking')}
                </p>
              </div>
            ) : (
              (allowance.gt(balance) || transactionWait) && (
                <div
                  className={`modal__button${
                    amountLteZero || amountGtBalance || transactionWait
                      ? ' disable'
                      : ''
                  }`}
                  onClick={() => {
                    if (
                      !account ||
                      amountLteZero ||
                      amountGtBalance ||
                      transactionWait
                    )
                      return;
                    setTransactionWait();
                    const emitter = buildEventEmitter(
                      ModalViewType.StakingOrUnstakingModal,
                      TransactionType.Stake,
                      JSON.stringify({
                        version: ElyfiVersions.V1,
                        chainId,
                        address: account,
                        stakingType: stakedToken,
                        unstakingAmount: utils.formatEther(
                          utils.parseEther(amount.value),
                        ),
                        maxOrNot: amount.max,
                      }),
                    );

                    emitter.clicked();

                    // setTxWaiting(true)

                    stakingAddress
                      ?.stake(
                        amount.max ? balance : utils.parseEther(amount.value),
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
                        failTransaction(
                          emitter,
                          closeHandler,
                          e,
                          TransactionType.Stake,
                        );
                      });
                  }}>
                  <p>
                    {amountGtBalance
                      ? t('staking.insufficient_balance')
                      : t('staking.staking')}
                  </p>
                </div>
              )
            ))}
        </section>
      </div>
    </div>
  );
};

export default StakingModalV2;
