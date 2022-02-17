import { reserveTokenData } from 'src/core/data/reserves';
import { useContext, useState, useMemo } from 'react';
import { toPercent } from 'src/utiles/formatters';
import DepositOrWithdrawModal from 'src/containers/DepositOrWithdrawModal';
import { BigNumber } from 'ethers';
import { useQuery } from '@apollo/client';
import { GetUser } from 'src/queries/__generated__/GetUser';
import { GET_USER } from 'src/queries/userQueries';
import { useTranslation, Trans } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import PriceContext from 'src/contexts/PriceContext';
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
import EventImage from 'src/assets/images/event_image.png';
import { useWeb3React } from '@web3-react/core';
import useCurrentChain from 'src/hooks/useCurrentChain';
import WalletDisconnect from 'src/components/WalletDisconnect';
import SelectWalletModal from 'src/components/SelectWalletModal';
import { isWrongNetwork } from 'src/utiles/isWalletConnect';

const Dashboard: React.FunctionComponent = () => {
  const { account } = useWeb3React();
  const { data } = useContext(SubgraphContext);
  const { elfiPrice } = useContext(PriceContext);
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
      {selectedBalance && selectedReserve && (
        <IncentiveModal
          visible={incentiveModalVisible}
          onClose={() => {
            setIncentiveModalVisible(false);
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
        />
      )}
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
        selectWalletModalVisible={() => setSelectWalletModalVisible(true)}
      />
      <NetworkChangeModal
        visible={wrongMainnetModalVisible}
        closeHandler={() => {
          setWrongMainnetModalVisible(false);
        }}
      />
      <WalletDisconnect
        modalVisible={disconnectModalVisible}
        selectWalletModalVisible={() => {
          setSelectWalletModalVisible(true);
        }}
        modalClose={() => setDisconnectModalVisible(false)}
      />
      <SelectWalletModal
        selectWalletModalVisible={selectWalletModalVisible}
        modalClose={() => {
          setSelectWalletModalVisible(false);
        }}
      />
      <div className="deposit">
        <TvlCounter />
        <div className="deposit__event">
          <div>
            <div className="deposit__event__box">
              <p>EVENT</p>
            </div>
            <div>
              <h2>
                <Trans i18nKey={t('dashboard.event_title')} />
              </h2>
              <p>2022.1.20 19:00:00 ~ 2022.1.26 19:00:00 KST</p>
            </div>
          </div>
          <img src={EventImage} />
        </div>
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
                  isWrongMainnet
                    ? setDisconnectModalVisible(true)
                    : !account
                    ? setConnectWalletModalvisible(true)
                    : unsupportedChainid
                    ? setWrongMainnetModalVisible(true)
                    : (e.preventDefault(),
                      setReserveData(reserve),
                      selectBalanceId(balance.id),
                      ReactGA.modalview(
                        balance.tokenName +
                          ModalViewType.DepositOrWithdrawModal,
                      ));
                }}
                reserveData={reserve}
                setIncentiveModalVisible={() => {
                  isWrongMainnet
                    ? setDisconnectModalVisible(true)
                    : !account
                    ? setConnectWalletModalvisible(true)
                    : unsupportedChainid
                    ? setWrongMainnetModalVisible(true)
                    : setIncentiveModalVisible(true);
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
