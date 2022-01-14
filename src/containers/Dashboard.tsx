import { useWeb3React } from '@web3-react/core';
import { reserveTokenData } from 'src/core/data/reserves';
import { useEffect, useContext, useState, useMemo } from 'react';
import { toPercent, toCompactForBignumber } from 'src/utiles/formatters';
import DepositOrWithdrawModal from 'src/containers/DepositOrWithdrawModal';
import { BigNumber, constants } from 'ethers';
import { useQuery } from '@apollo/client';
import { GetUser } from 'src/queries/__generated__/GetUser';
import { GET_USER } from 'src/queries/userQueries';
import { useTranslation } from 'react-i18next';
import envs from 'src/core/envs';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import calcExpectedIncentive from 'src/utiles/calcExpectedIncentive';
import moment from 'moment';
import PriceContext from 'src/contexts/PriceContext';
import {
  ERC20__factory,
  IncentivePool__factory,
} from '@elysia-dev/contract-typechain';
import ReactGA from 'react-ga';
import TokenTable from 'src/components/TokenTable';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';
import Token from 'src/enums/Token';
import IncentiveModal from 'src/containers/IncentiveModal';
import isWalletConnect from 'src/hooks/isWalletConnect';
import ConnectWalletModal from 'src/containers/ConnectWalletModal';
import WrongMainnetModal from 'src/containers/WrongMainnetModal';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
import ModalViewType from 'src/enums/ModalViewType';
import { useMediaQuery } from 'react-responsive';
import SubgraphContext, { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import TvlCounter from 'src/components/TvlCounter';
import { MainnetData } from 'src/core/data/mainnets';
import getTokenNameFromAddress from 'src/utiles/getTokenNameFromAddress';

type BalanceType = {
  loading: boolean;
  id: string;
  tokenName: Token.DAI | Token.USDT | Token.BUSD;
  value: BigNumber;
  incentive: BigNumber;
  expectedIncentiveBefore: BigNumber;
  expectedIncentiveAfter: BigNumber;
  deposit: BigNumber;
  updatedAt: number;
}

const initialBalanceState = {
  loading: false,
  value: constants.Zero,
  incentive: constants.Zero,
  expectedIncentiveBefore: constants.Zero,
  expectedIncentiveAfter: constants.Zero,
  deposit: constants.Zero,
  id: "",
  updatedAt: moment().unix(),
};

const remoteControlScroll = (ref: string) => {
  const element = document.getElementById(ref);

  const offset = 338;

  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element!.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

// TODO -> BUSDT는 BSC로 요청하자
// TODO : supported chain만 balance update하기
const fetchBalanceFrom = async (
  reserve: IReserveSubgraphData,
  account: string,
  library: any,
  mainnetType: MainnetType
) => {
  try {
    const incentive = await IncentivePool__factory.connect(
      reserve.incentivePool.id,
      library.getSigner(),
    ).getUserIncentive(account);
    return {
      value: await ERC20__factory.connect(reserve.id, library).balanceOf(
        account,
      ),
      incentive,
      expectedIncentiveBefore: incentive,
      expectedIncentiveAfter: incentive,
      governance: await ERC20__factory.connect(
        mainnetType === MainnetType.BSC ? envs.bscElfiAddress : envs.governanceAddress,
        library,
      ).balanceOf(account),
      deposit: await ERC20__factory.connect(
        reserve.lToken.id,
        library,
      ).balanceOf(account),
    };
  } catch (error) {
    return {
      value: constants.Zero,
      incentive: constants.Zero,
      expectedIncentiveBefore: constants.Zero,
      expectedIncentiveAfter: constants.Zero,
      governance: constants.Zero,
      deposit: constants.Zero
    }
  }
};

const Dashboard: React.FunctionComponent = () => {
  const { account, library, chainId } = useWeb3React();
  const { data } = useContext(SubgraphContext);
  const { elfiPrice } = useContext(PriceContext);
  const [reserveData, setReserveData] = useState<IReserveSubgraphData | undefined>();
  const { t } = useTranslation();
  const [balances, setBalances] = useState<BalanceType[]>(
    data.reserves
      .map((reserve) => {
        return {
          ...initialBalanceState,
          id: reserve.id,
          tokenName: getTokenNameFromAddress(reserve.id) as Token.DAI | Token.USDT | Token.BUSD,
        };
      }),
  );
  const {
    type: mainnetType,
    unsupportedChainid
  } = useContext(MainnetContext)

  const [incentiveModalVisible, setIncentiveModalVisible] =
    useState<boolean>(false);
  const { data: userConnection, refetch: refetchUserData } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } },
  );
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedBalanceId, selectBalanceId] = useState("");
  const [connectWalletModalvisible, setConnectWalletModalvisible] = useState<boolean>(false);
  const [wrongMainnetModalVisible, setWrongMainnetModalVisible] = useState<boolean>(false);
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

  // balance & reserve
  const loadBalance = async (id: string) => {
    if (!account) return;
    try {
      refetchUserData();

      setBalances(
        await Promise.all(
          balances.map(async (balance, _index) => {
            const reserve = data.reserves.find(r => r.id === id)
            if (balance.id !== id || !reserve) return {
              ...balance
            }
            return {
              ...balance,
              ...(await fetchBalanceFrom(reserve, account, library, mainnetType)),
              updatedAt: moment().unix(),
            };
          }),
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const loadBalances = async () => {
    if (!account) {
      return;
    }

    try {
      refetchUserData();
      setBalances(
        await Promise.all(
          data.reserves
            .map(async (reserve) => {
              return {
                id: reserve.id,
                loading: false,
                ...(await fetchBalanceFrom(reserve, account, library, mainnetType)),
                tokenName: getTokenNameFromAddress(reserve.id) as Token.DAI | Token.USDT | Token.BUSD,
                updatedAt: moment().unix(),
              } as BalanceType;
            }),
        ),
      );
    } catch (error) {
      console.error(error);
      setBalances(
        balances.map((data) => {
          return {
            ...data,
            loading: false,
          };
        }),
      );
    }
  };

  useEffect(() => {
    loadBalances();
  }, [account, mainnetType]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalances(
        balances.map((balance, index) => {
          const reserve = data.reserves.find(r => r.id === balance.id)
          if(!reserve) return balance;

          return {
            ...balance,
            expectedIncentiveBefore: balance.expectedIncentiveAfter,
            expectedIncentiveAfter: balance.incentive.add(
              calcExpectedIncentive(
                elfiPrice,
                balance.deposit,
                calcMiningAPR(
                  elfiPrice,
                  BigNumber.from(reserve.totalDeposit),
                ),
                balance.updatedAt,
              ),
            ),
          };
        }),
      );
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [balances]);

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
        />
      )}
      {
        selectedBalance && selectedReserve &&
        <IncentiveModal
          visible={incentiveModalVisible}
          onClose={() => {
            setIncentiveModalVisible(false);
          }}
          balanceBefore={selectedBalance.expectedIncentiveBefore}
          balanceAfter={selectedBalance.expectedIncentiveAfter}
          incentivePoolAddress={selectedReserve.incentivePool.id}
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
                      <a onClick={() => remoteControlScroll(`table-${index}`)}>
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

            if(!reserve) return <></>;

            return (
              <>
                <TokenTable
                  key={index}
                  index={index}
                  id={`table-${index}`}
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
                  tokenName={balance.tokenName}
                  tokenImage={reserveTokenData[balance.tokenName].image}
                  depositBalance={toCompactForBignumber(
                    balance.deposit || constants.Zero,
                    reserveTokenData[balance.tokenName].decimals,
                  )}
                  depositAPY={toPercent(reserve.depositAPY)}
                  miningAPR={toPercent(
                    calcMiningAPR(
                      elfiPrice,
                      BigNumber.from(reserve.totalDeposit),
                      reserveTokenData[balance.tokenName].decimals,
                    ) || '0',
                  )}
                  walletBalance={toCompactForBignumber(
                    balance.value || constants.Zero,
                    reserveTokenData[balance.tokenName].decimals,
                  )}
                  isDisable={!reserve}
                  skeletonLoading={balance.loading}
                  reserveData={reserve}
                  expectedIncentiveBefore={balance.expectedIncentiveBefore}
                  expectedIncentiveAfter={balance.expectedIncentiveAfter}
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
                />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
