import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, utils } from 'ethers';
import {
  useContext,
  useEffect,
  useMemo,
  FunctionComponent,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { GetUser_user } from 'src/queries/__generated__/GetUser';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import calcAccumulatedYield from 'src/utiles/calcAccumulatedYield';
import { toPercent } from 'src/utiles/formatters';
import calcCurrentIndex from 'src/utiles/calcCurrentIndex';
import PriceContext from 'src/contexts/PriceContext';
import useMoneyPool from 'src/hooks/useMoneyPool';
import useERC20Info from 'src/hooks/useERC20Info';
import useWaitingTx from 'src/hooks/useWaitingTx';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import ReserveData from 'src/core/data/reserves';
import ModalHeader from 'src/components/ModalHeader';
import ModalConverter from 'src/components/ModalConverter';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import ModalViewType from 'src/enums/ModalViewType';
import TransactionType from 'src/enums/TransactionType';
import ElyfiVersions from 'src/enums/ElyfiVersions';
import { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import useCurrentMoneypoolAddress from 'src/hooks/useCurrnetMoneypoolAddress';
import DepositBody from '../components/DepositBody';
import WithdrawBody from '../components/WithdrawBody';

const DepositOrWithdrawModal: FunctionComponent<{
  tokenName: string;
  visible: boolean;
  tokenImage: string;
  balance: BigNumber;
  depositBalance: BigNumber;
  reserve: IReserveSubgraphData;
  userData: GetUser_user | undefined | null;
  onClose: () => void;
  afterTx: () => void;
  transactionModal: () => void;
  round: number;
}> = ({
  tokenName,
  visible,
  tokenImage,
  balance,
  depositBalance,
  reserve,
  userData,
  onClose,
  afterTx,
  transactionModal,
  round,
}) => {
  const { account, chainId, library } = useWeb3React();
  const { elfiPrice } = useContext(PriceContext);

  const currentMoneypoolAddress = useCurrentMoneypoolAddress();

  const [selected, select] = useState<boolean>(true);
  const {
    allowance,
    loading,
    contract: reserveERC20,
    refetch,
  } = useERC20Info(reserve.id, currentMoneypoolAddress);

  const [liquidity, setLiquidity] = useState<{
    value: BigNumber;
    loaded: boolean;
  }>({ value: constants.Zero, loaded: false });
  const { waiting, wait } = useWaitingTx();
  const [currentIndex, setCurrentIndex] = useState<BigNumber>(
    calcCurrentIndex(
      BigNumber.from(reserve.lTokenInterestIndex),
      reserve.lastUpdateTimestamp,
      BigNumber.from(reserve.depositAPY),
    ),
  );
  const { t } = useTranslation();
  const moneyPool = useMoneyPool();
  const { setTransaction, failTransaction } = useContext(TxContext);

  const tokenInfo = ReserveData.find(
    (_reserve) => _reserve.address === reserve.id,
  );

  const accumulatedYield = useMemo(() => {
    return calcAccumulatedYield(
      balance,
      currentIndex,
      userData?.lTokenMint.filter(
        (mint) => mint.lToken.id === reserve.lToken.id,
      ) || [],
      userData?.lTokenBurn.filter(
        (burn) => burn.lToken.id === reserve.lToken.id,
      ) || [],
    );
  }, [reserve, userData, currentIndex, balance]);

  const yieldProduced = useMemo(() => {
    return accumulatedYield.sub(
      calcAccumulatedYield(
        // FIXME
        // Tricky constant.One
        // yieldProduced should be calculated with last burn index
        constants.One,
        BigNumber.from(
          userData?.lTokenBurn[userData.lTokenBurn.length - 1]?.index ||
            reserve.lTokenInterestIndex,
        ),
        userData?.lTokenMint.filter(
          (mint) => mint.lToken.id === reserve.lToken.id,
        ) || [],
        userData?.lTokenBurn.filter(
          (burn) => burn.lToken.id === reserve.lToken.id,
        ) || [],
      ),
    );
  }, [accumulatedYield, reserve, userData]);

  const increateAllowance = async () => {
    if (!account) return;
    const emitter = buildEventEmitter(
      ModalViewType.DepositOrWithdrawModal,
      TransactionType.Approve,
      JSON.stringify({
        version: ElyfiVersions.V1,
        chainId,
        address: account,
        moneypoolType: tokenName,
      }),
    );

    emitter.clicked();

    reserveERC20
      .approve(currentMoneypoolAddress, constants.MaxUint256)
      .then((tx) => {
        setTransaction(
          tx,
          emitter,
          RecentActivityType.Approve,
          () => {
            transactionModal();
            onClose();
          },
          () => {
            refetch();
          },
        );
      })
      .catch((error) => {
        console.error(error);
        emitter.canceled();
      });
  };

  const requestDeposit = async (amount: BigNumber, max: boolean) => {
    if (!account) return;

    const emitter = buildEventEmitter(
      ModalViewType.DepositOrWithdrawModal,
      TransactionType.Deposit,
      JSON.stringify({
        version: ElyfiVersions.V1,
        chainId,
        address: account,
        moneypoolType: tokenName,
        depositAmount: utils.formatUnits(amount, tokenInfo?.decimals),
        maxOrNot: max,
      }),
    );

    emitter.clicked();

    moneyPool
      ?.deposit(reserve.id, account, max ? balance : amount)
      .then((tx) => {
        setTransaction(
          tx,
          emitter,
          RecentActivityType.Deposit,
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
        failTransaction(emitter, onClose, error);
        console.error(error);
      });
  };

  const reqeustWithdraw = (amount: BigNumber, max: boolean) => {
    if (!account) return;

    const emitter = buildEventEmitter(
      ModalViewType.DepositOrWithdrawModal,
      TransactionType.Withdraw,
      JSON.stringify({
        version: ElyfiVersions.V1,
        chainId,
        address: account,
        moneypoolType: tokenName,
        withdrawalAmount: utils.formatUnits(amount, tokenInfo?.decimals),
        maxOrNot: max,
      }),
    );

    emitter.clicked();

    moneyPool
      ?.withdraw(reserve.id, account, max ? constants.MaxUint256 : amount)
      .then((tx) => {
        setTransaction(
          tx,
          emitter,
          RecentActivityType.Withdraw,
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
        failTransaction(emitter, onClose, error);
        console.error(error);
      });
  };

  useEffect(() => {
    if (!reserve) return;
    reserveERC20
      .balanceOf(reserve.lToken.id)
      .then((value) => {
        setLiquidity({
          value,
          loaded: true,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reserve, reserveERC20, account]);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setCurrentIndex(
          calcCurrentIndex(
            BigNumber.from(reserve.lTokenInterestIndex),
            reserve.lastUpdateTimestamp,
            BigNumber.from(reserve.depositAPY),
          ),
        ),
      500,
    );

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div
      className="modal modal--deposit"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader image={tokenImage} title={tokenName} onClose={onClose} />
        <ModalConverter
          handlerProps={selected}
          setState={select}
          title={[t('dashboard.deposit'), t('dashboard.withdraw')]}
        />
        {waiting ? (
          <LoadingIndicator />
        ) : selected ? (
          <DepositBody
            tokenInfo={tokenInfo!}
            depositAPY={toPercent(reserve.depositAPY || '0')}
            miningAPR={toPercent(
              calcMiningAPR(
                elfiPrice,
                BigNumber.from(reserve.totalDeposit),
                tokenInfo?.decimals,
              ),
            )}
            balance={balance}
            isApproved={!loading && allowance.gt(balance)}
            increaseAllownace={increateAllowance}
            deposit={requestDeposit}
            isLoading={loading}
          />
        ) : (
          <WithdrawBody
            tokenInfo={tokenInfo!}
            depositBalance={depositBalance}
            accumulatedYield={accumulatedYield}
            yieldProduced={yieldProduced}
            liquidity={liquidity.value}
            withdraw={reqeustWithdraw}
          />
        )}
      </div>
    </div>
  );
};

export default DepositOrWithdrawModal;
