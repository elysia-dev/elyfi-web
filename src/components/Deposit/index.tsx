import { useContext, useState, useMemo, lazy, Suspense } from 'react';
import { reserveTokenData } from 'src/core/data/reserves';
import { BigNumber } from 'ethers';
import { useQuery } from '@apollo/client';
import { GetUser } from 'src/queries/__generated__/GetUser';
import { GET_USER } from 'src/queries/userQueries';
import ReactGA from 'react-ga';
import ModalViewType from 'src/enums/ModalViewType';
import { useMediaQuery } from 'react-responsive';
import SubgraphContext, {
  IReserveSubgraphData,
} from 'src/contexts/SubgraphContext';
import MainnetContext from 'src/contexts/MainnetContext';
import { MainnetData } from 'src/core/data/mainnets';
import getIncentivePoolAddress from 'src/core/utils/getIncentivePoolAddress';
import useBalances from 'src/hooks/useBalances';
import { useWeb3React } from '@web3-react/core';
import useCurrentChain from 'src/hooks/useCurrentChain';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import Skeleton from 'react-loading-skeleton';

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
  const { data } = useContext(SubgraphContext);
  const [reserveData, setReserveData] = useState<
    IReserveSubgraphData | undefined
  >();
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
  const selectedBalance = balances.find(
    (balance) => balance.id === selectedBalanceId,
  );
  const selectedReserve = useMemo(
    () => data.reserves.find((balance) => balance.id === selectedBalanceId),
    [selectedBalanceId],
  );
  const supportedBalances = useMemo(() => {
    return balances.filter((balance) =>
      supportedTokens.some((token) => token === balance.id),
    );
  }, [supportedTokens, balances]);

  const isWrongMainnet = isWrongNetwork(getMainnetType, currentChain?.name);

  const isEnoughWide = useMediaQuery({
    query: '(min-width: 1439px)',
  });

  const [isModals, setIsModals] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        {reserveData && selectedBalance && (
          <Suspense fallback={null}>
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
          </Suspense>
        )}
        {selectedBalance && selectedReserve && (
          <Suspense fallback={null}>
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
          </Suspense>
        )}
        <Suspense fallback={null}>
          <TransactionConfirmModal
            visible={transactionModal}
            closeHandler={() => {
              setTransactionModal(false);
            }}
          />
        </Suspense>
        {isModals && (
          <Suspense fallback={null}>
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
          </Suspense>
        )}
      </Suspense>
      <div className="deposit">
        <Suspense fallback={<Skeleton width={"100%"} height={300} />}>
          <TvlCounter />
        </Suspense>
        <Suspense fallback={<Skeleton width={"100%"} height={20} />}>
          <RewardPlanButton stakingType={'deposit'} />
        </Suspense>
        <div className="deposit__table__wrapper">
          {isEnoughWide && (
            <div className="deposit__remote-control__wrapper">
              <Suspense fallback={<Skeleton width={120} height={180} style={{ position: 'fixed' }} />}>
                <RemoteControl data={data} supportedBalances={supportedBalances} />
              </Suspense>
            </div>
          )}
          {supportedBalances.map((balance, index) => {
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
