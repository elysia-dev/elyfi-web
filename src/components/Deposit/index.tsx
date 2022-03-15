import { reserveTokenData } from 'src/core/data/reserves';
import { useContext, useState, useMemo, lazy } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import envs from 'src/core/envs';
import { toPercent } from 'src/utiles/formatters';
import { BigNumber, constants } from 'ethers';
import { GET_USER } from 'src/queries/userQueries';
import { useTranslation } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import ReactGA from 'react-ga';

import ModalViewType from 'src/enums/ModalViewType';
import { useMediaQuery } from 'react-responsive';
import MainnetContext from 'src/contexts/MainnetContext';
import { MainnetData } from 'src/core/data/mainnets';
import getIncentivePoolAddress from 'src/core/utils/getIncentivePoolAddress';
import scrollToOffeset from 'src/core/utils/scrollToOffeset';
import useBalances from 'src/hooks/useBalances';
import { useWeb3React } from '@web3-react/core';
import useCurrentChain from 'src/hooks/useCurrentChain';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import Skeleton from 'react-loading-skeleton';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useReserveData from 'src/hooks/useReserveData';
import { IReserveSubgraphData } from 'src/core/types/reserveSubgraph';
import Token from 'src/enums/Token';
import ReserveToken from 'src/core/types/ReserveToken';
import MainnetType from 'src/enums/MainnetType';
import request from 'graphql-request';

import TokenTable from 'src/components/Deposit/TokenTable';

const TransactionConfirmModal = lazy(() => import('src/components/Modal/TransactionConfirmModal'))
const IncentiveModal = lazy(() => import('src/components/Modal/IncentiveModal'))
const ConnectWalletModal = lazy(() => import('src/components/Modal/ConnectWalletModal'))
const NetworkChangeModal = lazy(() => import('src/components/Modal/NetworkChangeModal'))
const DepositOrWithdrawModal = lazy(() => import('src/components/Modal/DepositOrWithdrawModal'));
const WalletDisconnect = lazy(() => import('src/components/Modal/WalletDisconnect'));
const SelectWalletModal = lazy(() => import('src/components/Modal/SelectWalletModal'));

const TvlCounter = lazy(() => import('src/components/Deposit/TvlCounter'))
const RewardPlanButton = lazy(() => import('src/components/RewardPlan/RewardPlanButton'))
const RemoteControl = lazy(() => import('./RemoteControl'));

const Dashboard: React.FunctionComponent = () => {
  const { account } = useWeb3React();
  const { reserveState, loading: subgraphLoading } = useReserveData();
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );
  const [reserveData, setReserveData] = useState<
    IReserveSubgraphData | undefined
  >();
  const { t } = useTranslation();
  const { unsupportedChainid, type: getMainnetType } =
    useContext(MainnetContext);
  const [incentiveModalVisible, setIncentiveModalVisible] =
    useState<boolean>(false);
  const { mutate } = useSWRConfig();

  const { data: bscUserConnection } = useSWR('bscUser', () =>
    request(
      envs.subgraphApiEndpoint.bscSubgraphURI,
      GET_USER(account?.toLocaleLowerCase() || ''),
    ),
  );

  const { data: ethUserConnection } = useSWR('ethUser', () =>
    request(
      envs.subgraphApiEndpoint.subgraphURI,
      GET_USER(account?.toLocaleLowerCase() || ''),
    ),
  );

  const { balances, loading, loadBalance } = useBalances(() =>
    mutate(getMainnetType === MainnetType.BSC ? 'bscUser' : 'ethUser'),
  );
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedBalanceId, selectBalanceId] = useState('');
  const [connectWalletModalvisible, setConnectWalletModalvisible] =
    useState<boolean>(false);
  const [wrongMainnetModalVisible, setWrongMainnetModalVisible] =
    useState<boolean>(false);
  const [disconnectModalVisible, setDisconnectModalVisible] = useState(false);
  const [selectWalletModalVisible, setSelectWalletModalVisible] =
    useState(false);
  const [round, setRound] = useState(1);
  const currentChain = useCurrentChain();
  const [transactionWait, setTransactionWait] = useState<boolean>(false);
  const { type: currentNetworkType } = useContext(MainnetContext);
  const supportedTokens = useMemo(() => {
    return MainnetData[currentNetworkType].supportedTokens;
  }, [currentNetworkType]);
  const selectedBalance = useMemo(
    () =>
      balances.find((balance) =>
        balance ? balance.id === selectedBalanceId : false,
      ),
    [balances, selectedBalanceId],
  );
  const selectedReserve = useMemo(
    () =>
      reserveState.reserves.find((balance) => balance.id === selectedBalanceId),
    [selectedBalanceId, reserveState],
  );

  const initSupportedTokens = useMemo(
    () =>
      getMainnetType === MainnetType.BSC
        ? [Token.BUSD]
        : [Token.DAI, Token.USDT],
    [getMainnetType],
  );

  const supportedBalances = useMemo(() => {
    const supportBlalance = balances.filter((balance) =>
      supportedTokens.some((token) => (balance ? token === balance.id : false)),
    );
    return supportBlalance.length === 0
      ? initSupportedTokens.map((token) => ({
          id: '',
          tokenName: token as ReserveToken,
          value: constants.Zero,
          expectedIncentiveBefore: constants.Zero,
          expectedIncentiveAfter: constants.Zero,
          expectedAdditionalIncentiveBefore: constants.Zero,
          expectedAdditionalIncentiveAfter: constants.Zero,
          deposit: constants.Zero,
          updatedAt: 0,
        }))
      : supportBlalance;
  }, [supportedTokens, balances]);

  const isWrongMainnet = isWrongNetwork(getMainnetType, currentChain?.name);

  const isEnoughWide = useMediaQuery({
    query: '(min-width: 1439px)',
  });

  const [isModals, setIsModals] = useState(false);

  return (
    <>
      {reserveData && selectedBalance && (
        <DepositOrWithdrawModal
          reserve={reserveData}
          userData={
            getMainnetType === MainnetType.BSC
              ? bscUserConnection?.user
              : ethUserConnection?.user
          }
          tokenName={selectedBalance.tokenName}
          tokenImage={reserveTokenData[selectedBalance.tokenName].image}
          visible={!!reserveData}
          onClose={() => {
            setReserveData(undefined);
            setTransactionWait(false);
          }}
          balance={selectedBalance.value}
          depositBalance={BigNumber.from(selectedBalance.deposit)}
          afterTx={() => loadBalance(selectedBalanceId)}
          transactionModal={() => setTransactionModal(true)}
          round={round}
          transactionWait={transactionWait}
          setTransactionWait={() => setTransactionWait(true)}
          disableTransactionWait={() => setTransactionWait(false)}
        />
      )}
      {selectedBalance && selectedReserve && (
        <IncentiveModal
          visible={incentiveModalVisible}
          onClose={() => {
            setIncentiveModalVisible(false);
            setTransactionWait(false);
          }}
          balanceBefore={
            round === 1
              ? selectedBalance.expectedIncentiveBefore
              : selectedBalance.expectedAdditionalIncentiveBefore
          }
          balanceAfter={
            round === 1
              ? selectedBalance.expectedIncentiveAfter
              : selectedBalance.expectedAdditionalIncentiveAfter
          }
          incentivePoolAddress={getIncentivePoolAddress(
            round,
            selectedBalance.tokenName,
          )}
          tokenName={selectedBalance.tokenName}
          afterTx={() => loadBalance(selectedBalanceId)}
          transactionModal={() => setTransactionModal(true)}
          transactionWait={transactionWait}
          setTransactionWait={() => setTransactionWait(true)}
        />
      )}
      <TransactionConfirmModal
        visible={transactionModal}
        closeHandler={() => {
          setTransactionModal(false);
        }}
      />
      {isModals && (
        <>
          <NetworkChangeModal
            visible={unsupportedChainid}
            closeHandler={() => {
              setWrongMainnetModalVisible(false);
              setIsModals(false);
            }}
          />
          <ConnectWalletModal
            visible={!account && !selectWalletModalVisible}
            onClose={() => {
              setConnectWalletModalvisible(false);
              setIsModals(false);
            }}
            selectWalletModalVisible={() => setSelectWalletModalVisible(true)}
          />
          <WalletDisconnect
            modalVisible={isWrongMainnet && !selectWalletModalVisible}
            selectWalletModalVisible={() => {
              setSelectWalletModalVisible(true);
            }}
            modalClose={() => {
              setDisconnectModalVisible(false);
              setIsModals(false);
            }}
          />
          <SelectWalletModal
            selectWalletModalVisible={selectWalletModalVisible}
            modalClose={() => {
              setSelectWalletModalVisible(false);
              setIsModals(false);
            }}
          />
        </>
      )}

      <div className="deposit">
        <TvlCounter />
        <RewardPlanButton stakingType={'deposit'} />
        <div className="deposit__table__wrapper">
          {isEnoughWide && (
            <div className="deposit__remote-control__wrapper">
              <div className="deposit__remote-control">
                {supportedBalances.map((balance, index) => {
                  const reserve = reserveState.reserves.find(
                    (d) => d.id === balance.id,
                  );

                  if (!reserve) return <></>;

                  return (
                    <a onClick={() => scrollToOffeset(`table-${index}`, 678)}>
                      <div>
                        <div className="deposit__remote-control__images">
                          <img
                            src={reserveTokenData[balance.tokenName].image}
                          />
                        </div>
                        <div className="deposit__remote-control__name">
                          <p className="montserrat">{balance.tokenName}</p>
                        </div>
                        <p className="deposit__remote-control__apy bold">
                          {reserve.depositAPY ? (
                            toPercent(reserve.depositAPY)
                          ) : (
                            <Skeleton width={50} height={20} />
                          )}
                        </p>
                        <div className="deposit__remote-control__mining">
                          <p>{t('dashboard.token_mining_apr')}</p>
                          {priceData && reserve.totalDeposit ? (
                            <p>
                              {toPercent(
                                calcMiningAPR(
                                  priceData.elfiPrice,
                                  BigNumber.from(reserve.totalDeposit || 0),
                                  reserveTokenData[balance.tokenName].decimals,
                                ) || '0',
                              )}
                            </p>
                          ) : (
                            <Skeleton width={50} height={13} />
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {supportedBalances.map((balance, index) => {
            const reserve = reserveState.reserves.find(
              (d) => d.id === balance.id,
            );

            return (
              <TokenTable
                key={index}
                id={`table-${index}`}
                balance={balance}
                onClick={(e: any) => {
                  if (!isWrongMainnet && account && !unsupportedChainid) {
                    e.preventDefault();
                    setReserveData(reserve);
                    selectBalanceId(balance.id);
                    ReactGA.modalview(
                      balance.tokenName + ModalViewType.DepositOrWithdrawModal,
                    );
                    return;
                  }
                  setIsModals(true);
                }}
                reserveData={reserve}
                setIncentiveModalVisible={() => {
                  if (!isWrongMainnet && account && !unsupportedChainid) {
                    setIncentiveModalVisible(true);
                    return;
                  }
                  setIsModals(true);
                }}
                setModalNumber={() => selectBalanceId(balance.id)}
                modalview={() =>
                  ReactGA.modalview(
                    balance.tokenName + ModalViewType.IncentiveModal,
                  )
                }
                setRound={setRound}
                loading={loading}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
