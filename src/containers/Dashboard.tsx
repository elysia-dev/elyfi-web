import { reserveTokenData } from 'src/core/data/reserves';
import { useContext, useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { toPercent } from 'src/utiles/formatters';
import DepositOrWithdrawModal from 'src/containers/DepositOrWithdrawModal';
import { BigNumber } from 'ethers';
import { useQuery } from '@apollo/client';
import { GetUser } from 'src/queries/__generated__/GetUser';
import { GET_USER } from 'src/queries/userQueries';
import { useTranslation, Trans } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import ReactGA from 'react-ga';
import TokenTable from 'src/components/TokenTable';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';
import IncentiveModal from 'src/containers/IncentiveModal';
import ConnectWalletModal from 'src/containers/ConnectWalletModal';
import NetworkChangeModal from 'src/components/NetworkChangeModal';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';

import ModalViewType from 'src/enums/ModalViewType';
import { useMediaQuery } from 'react-responsive';
import SubgraphContext, {
  IReserveSubgraphData,
} from 'src/contexts/SubgraphContext';
import MainnetContext from 'src/contexts/MainnetContext';
import TvlCounter from 'src/components/TvlCounter';
import { MainnetData } from 'src/core/data/mainnets';
import getIncentivePoolAddress from 'src/core/utils/getIncentivePoolAddress';
import scrollToOffeset from 'src/core/utils/scrollToOffeset';
import useBalances from 'src/hooks/useBalances';
import { useWeb3React } from '@web3-react/core';
import useCurrentChain from 'src/hooks/useCurrentChain';
import WalletDisconnect from 'src/components/WalletDisconnect';
import SelectWalletModal from 'src/components/SelectWalletModal';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import Skeleton from 'react-loading-skeleton';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';

const Dashboard: React.FunctionComponent = () => {
  const { account } = useWeb3React();
  const { data, loading: subgraphLoading } = useContext(SubgraphContext);
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
  const { data: userConnection, refetch: refetchUserData } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } },
  );
  const { balances, loading, loadBalance } = useBalances(refetchUserData);
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
    [balances],
  );
  const selectedReserve = useMemo(
    () => data.reserves.find((balance) => balance.id === selectedBalanceId),
    [selectedBalanceId, data],
  );
  const supportedBalances = useMemo(() => {
    return balances.filter((balance) =>
      supportedTokens.some((token) => (balance ? token === balance.id : false)),
    );
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
          userData={userConnection?.user}
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
                  const reserve = data.reserves.find(
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
                          {toPercent(reserve.depositAPY)}
                        </p>
                        <div className="deposit__remote-control__mining">
                          <p>{t('dashboard.token_mining_apr')}</p>
                          {priceData ? (
                            <p>
                              {toPercent(
                                calcMiningAPR(
                                  priceData.elfiPrice,
                                  BigNumber.from(reserve.totalDeposit),
                                  reserveTokenData[balance.tokenName].decimals,
                                ) || '0',
                              )}
                            </p>
                          ) : (
                            <Skeleton width={100} height={20} />
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {subgraphLoading || supportedBalances.length === 0 ? (
            <>
              <Skeleton width={'100%'} height={889} />
            </>
          ) : (
            supportedBalances.map((balance, index) => {
              const reserve = data.reserves.find((d) => d.id === balance.id);

              if (!reserve) return <></>;

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
                        balance.tokenName +
                          ModalViewType.DepositOrWithdrawModal,
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
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
