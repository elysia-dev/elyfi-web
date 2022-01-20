import { useWeb3React } from '@web3-react/core';
import { reserveTokenData } from 'src/core/data/reserves';
import { useContext, useState, useMemo } from 'react';
import { toPercent } from 'src/utiles/formatters';
import DepositOrWithdrawModal from 'src/containers/DepositOrWithdrawModal';
import { BigNumber } from 'ethers';
import { useQuery } from '@apollo/client';
import { GetUser } from 'src/queries/__generated__/GetUser';
import { GET_USER } from 'src/queries/userQueries';
import { useTranslation } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import PriceContext from 'src/contexts/PriceContext';
import ReactGA from 'react-ga';
import TokenTable from 'src/components/TokenTable';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';
import IncentiveModal from 'src/containers/IncentiveModal';
import isWalletConnect from 'src/hooks/isWalletConnect';
import ConnectWalletModal from 'src/containers/ConnectWalletModal';
import WrongMainnetModal from 'src/containers/WrongMainnetModal';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';

import ModalViewType from 'src/enums/ModalViewType';
import { useMediaQuery } from 'react-responsive';
import SubgraphContext, { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import MainnetContext from 'src/contexts/MainnetContext';
import TvlCounter from 'src/components/TvlCounter';
import { MainnetData } from 'src/core/data/mainnets';
import getIncentivePoolAddress from 'src/core/utils/getIncentivePoolAddress';
import scrollToOffeset from 'src/core/utils/scrollToOffeset';
import useBalances from 'src/hooks/useBalances';

const Dashboard: React.FunctionComponent = () => {
  const { account } = useWeb3React();
  const { data } = useContext(SubgraphContext);
  const { elfiPrice } = useContext(PriceContext);
  const [reserveData, setReserveData] = useState<IReserveSubgraphData | undefined>();
  const { t } = useTranslation();
  const {
    unsupportedChainid
  } = useContext(MainnetContext)
  const [incentiveModalVisible, setIncentiveModalVisible] =
    useState<boolean>(false);
  const { data: userConnection, refetch: refetchUserData } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } },
  );
  const { balances, loading, loadBalance } = useBalances(refetchUserData);
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedBalanceId, selectBalanceId] = useState("");
  const [connectWalletModalvisible, setConnectWalletModalvisible] = useState<boolean>(false);
  const [wrongMainnetModalVisible, setWrongMainnetModalVisible] = useState<boolean>(false);
  const [round, setRound] = useState(1);
  const walletConnect = isWalletConnect();
  const { type: currentNetworkType } = useContext(MainnetContext)
  const supportedTokens = useMemo(() => {return MainnetData[currentNetworkType].supportedTokens}, [currentNetworkType])
  const selectedBalance = balances.find(balance => balance.id === selectedBalanceId)
  const selectedReserve = useMemo(() => data.reserves.find(balance => balance.id === selectedBalanceId), [selectedBalanceId])
  const supportedBalances = useMemo(() => {
    return balances.filter((balance) => supportedTokens.some((token) => token === balance.id))
  }, [supportedTokens, balances])

  const isEnoughWide = useMediaQuery({
    query: '(min-width: 1439px)',
  });

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
          }}
          balance={selectedBalance.value}
          depositBalance={BigNumber.from(selectedBalance.deposit)}
          afterTx={() => loadBalance(selectedBalanceId)}
          transactionModal={() => setTransactionModal(true)}
          round={round}
        />
      )}
      {
        selectedBalance && selectedReserve &&
        <IncentiveModal
          visible={incentiveModalVisible}
          onClose={() => {
            setIncentiveModalVisible(false)
          }}
          balanceBefore={
            round === 1 ? selectedBalance.expectedIncentiveBefore : selectedBalance.expectedAdditionalIncentiveBefore
          }
          balanceAfter={
            round === 1 ? selectedBalance.expectedIncentiveAfter : selectedBalance.expectedAdditionalIncentiveAfter
          }
          incentivePoolAddress={getIncentivePoolAddress(round, selectedBalance.tokenName)}
          tokenName={selectedBalance.tokenName}
          afterTx={() => loadBalance(selectedBalanceId)}
          transactionModal={() => setTransactionModal(true)}
        />
      }
      <TransactionConfirmModal
        visible={transactionModal}
        closeHandler={() => {
          setTransactionModal(false);
        }}
      />
      <ConnectWalletModal
        visible={connectWalletModalvisible}
        onClose={() => {
          setConnectWalletModalvisible(false);
        }}
      />
      <WrongMainnetModal
        visible={wrongMainnetModalVisible}
        onClose={() => {
          setWrongMainnetModalVisible(false);
        }}
      />

      <div className="deposit">
        <TvlCounter />
        <RewardPlanButton stakingType={'deposit'} />
        <div className="deposit__table__wrapper">
          {
            isEnoughWide && (
              <div className="deposit__remote-control__wrapper">
                <div className="deposit__remote-control">
                  {supportedBalances.map((balance, index) => {
                    const reserve = data.reserves.find((d) => d.id === balance.id);

                    if (!reserve) return <></>;

                    return (
                      <a onClick={() => scrollToOffeset(`table-${index}`, 338)}>
                        <div>
                          <div className="deposit__remote-control__images">
                            <img src={reserveTokenData[balance.tokenName].image} />
                          </div>
                          <div className="deposit__remote-control__name">
                            <p className="montserrat">{balance.tokenName}</p>
                          </div>
                          <p className="deposit__remote-control__apy bold">
                            {toPercent(reserve.depositAPY)}
                          </p>
                          <div className="deposit__remote-control__mining">
                            <p>{t('dashboard.token_mining_apr')}</p>
                            <p>
                              {toPercent(
                                calcMiningAPR(
                                  elfiPrice,
                                  BigNumber.from(reserve.totalDeposit),
                                  reserveTokenData[balance.tokenName].decimals,
                                ) || '0',
                              )}
                            </p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )
          }

          {supportedBalances.map((balance, index) => {
            const reserve = data.reserves.find((d) => d.id === balance.id);

            if (!reserve) return <></>;

            return (
              <TokenTable
                key={index}
                id={`table-${index}`}
                balance={balance}
                onClick={(e: any) => {
                  walletConnect === false
                    ? (
                      setConnectWalletModalvisible(true),
                      ReactGA.modalview(balance.tokenName + ModalViewType.DepositConnectWalletModal)
                    ) :
                    unsupportedChainid
                      ? (
                        setWrongMainnetModalVisible(true)
                      ) : (
                        e.preventDefault(),
                        setReserveData(reserve),
                        selectBalanceId(balance.id),
                        ReactGA.modalview(balance.tokenName + ModalViewType.DepositOrWithdrawModal)
                      )
                }}
                reserveData={reserve}
                setIncentiveModalVisible={() => {
                  walletConnect === false
                    ? (
                      setConnectWalletModalvisible(true),
                      ReactGA.modalview(balance.tokenName + ModalViewType.IncentiveModal)
                    ) :
                    unsupportedChainid
                      ? (
                        setWrongMainnetModalVisible(true)
                      ) :
                      setIncentiveModalVisible(true);
                }}
                setModalNumber={() => selectBalanceId(balance.id)}
                modalview={() => ReactGA.modalview(balance.tokenName + ModalViewType.IncentiveModal)}
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
