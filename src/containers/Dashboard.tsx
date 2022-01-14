import { useWeb3React } from '@web3-react/core';
import ReserveData, { reserveTokenData } from 'src/core/data/reserves';
import { useEffect, useContext, useState } from 'react';
import { toPercent, toCompactForBignumber } from 'src/utiles/formatters';
import DepositOrWithdrawModal from 'src/containers/DepositOrWithdrawModal';
import ReservesContext from 'src/contexts/ReservesContext';
import { BigNumber, constants } from 'ethers';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { useHistory, useLocation } from 'react-router-dom';
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
import CountUp from 'react-countup';
import Token from 'src/enums/Token';
import HeaderCircle from 'src/assets/images/title-circle.png';
import IncentiveModal from 'src/containers/IncentiveModal';
import useTvl from 'src/hooks/useTvl';
import isWalletConnect from 'src/hooks/isWalletConnect';
import ConnectWalletModal from 'src/containers/ConnectWalletModal';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
import {
  daiMoneyPoolTime,
  tetherMoneyPoolTime,
} from 'src/core/data/moneypoolTimes';
import ModalViewType from 'src/enums/ModalViewType';
import IncentiveNotification from 'src/components/IncentiveNotificationModal';

const initialBalanceState = {
  loading: false,
  value: constants.Zero,
  incentiveRound1: constants.Zero,
  incentiveRound2: constants.Zero,
  expectedIncentiveBefore: constants.Zero,
  expectedIncentiveAfter: constants.Zero,
  expectedAdditionalIncentiveBefore: constants.Zero,
  expectedAdditionalIncentiveAfter: constants.Zero,
  deposit: constants.Zero,
  updatedAt: moment().unix(),
};
const usdFormatter = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
});

const Dashboard: React.FunctionComponent = () => {
  const { account, library } = useWeb3React();
  const location = useLocation();
  const history = useHistory();
  const {
    reserves,
    refetch: refetchReserve,
    round,
  } = useContext(ReservesContext);
  const { elfiPrice } = useContext(PriceContext);
  const reserveId = new URLSearchParams(location.search).get('reserveId');
  const [reserve, setReserve] = useState<GetAllReserves_reserves | undefined>(
    reserves.find((reserve) => reserveId === reserve.id),
  );
  const { t, i18n } = useTranslation();
  const [balances, setBalances] = useState<
    {
      loading: boolean;
      tokenName: Token.DAI | Token.USDT;
      value: BigNumber;
      incentiveRound1: BigNumber;
      incentiveRound2: BigNumber;
      expectedIncentiveBefore: BigNumber;
      expectedIncentiveAfter: BigNumber;
      expectedAdditionalIncentiveBefore: BigNumber;
      expectedAdditionalIncentiveAfter: BigNumber;
      deposit: BigNumber;
      updatedAt: number;
    }[]
  >(
    reserves.map((reserve) => {
      return {
        ...initialBalanceState,
        tokenName: reserve.id === envs.daiAddress ? Token.DAI : Token.USDT,
      };
    }),
  );
  const [incentiveModalVisible, setIncentiveModalVisible] =
    useState<boolean>(false);
  const { data: userConnection, refetch: refetchUserData } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } },
  );
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedModalNumber, setModalNumber] = useState(0);
  const [selectedModalToken, setModalToken] = useState<Token.DAI | Token.USDT>(
    Token.DAI,
  );
  const { value: tvl, loading: tvlLoading } = useTvl();
  const [prevTvl, setPrevTvl] = useState(0);
  const [connectWalletModalvisible, setConnectWalletModalvisible] =
    useState<boolean>(false);
  const [
    incentiveNotificationModalvisble,
    setIncentiveNotificationModalvisble,
  ] = useState(false);
  const walletConnect = isWalletConnect();
  const { value: mediaQuery } = useMediaQueryType();

  useEffect(() => {
    const paramsData = reserves.find((_reserve) => reserveId === _reserve.id);
    const tokenInfo = paramsData
      ? ReserveData.findIndex((_reserve) => _reserve.address === paramsData.id)
      : undefined;

    setModalNumber(tokenInfo ? tokenInfo : 0);
  }, [reserveId]);

  const getIncentiveByRound = async (
    tokenName: Token.DAI | Token.USDT,
    account: string,
  ) => {
    const incentiveRound1 = await IncentivePool__factory.connect(
      tokenName === Token.DAI
        ? envs.prevDaiIncentivePool
        : envs.prevUSDTIncentivePool,
      library.getSigner(),
    ).getUserIncentive(account);

    const incentiveRound2 = await IncentivePool__factory.connect(
      tokenName === Token.DAI
        ? envs.currentDaiIncentivePool
        : envs.currentUSDTIncentivePool,
      library.getSigner(),
    ).getUserIncentive(account);

    return {
      incentiveRound1,
      incentiveRound2,
    };
  };

  const fetchBalanceFrom = async (
    reserve: GetAllReserves_reserves,
    account: string,
    tokenName: Token.DAI | Token.USDT,
  ) => {
    try {
      const { incentiveRound1, incentiveRound2 } = await getIncentiveByRound(
        tokenName,
        account,
      );
      return {
        value: await ERC20__factory.connect(reserve.id, library).balanceOf(
          account,
        ),
        incentiveRound1,
        incentiveRound2,
        expectedIncentiveBefore: incentiveRound1,
        expectedIncentiveAfter: incentiveRound1,
        expectedAdditionalIncentiveBefore: incentiveRound2,
        expectedAdditionalIncentiveAfter: incentiveRound2,
        governance: await ERC20__factory.connect(
          envs.governanceAddress,
          library,
        ).balanceOf(account),
        deposit: await ERC20__factory.connect(
          reserve.lToken.id,
          library,
        ).balanceOf(account),
      };
    } catch (error) {
      console.error(error);
    }
  };

  const loadBalance = async (index: number) => {
    if (!account) return;
    try {
      // refetchReserve();
      refetchUserData();

      setBalances(
        await Promise.all(
          balances.map(async (data, _index) => {
            if (_index !== index) return data;
            return {
              ...data,
              ...(await fetchBalanceFrom(
                reserves[index],
                account,
                data.tokenName,
              )),
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
      // refetchReserve();
      refetchUserData();
      setBalances(
        await Promise.all(
          reserves.map(async (reserve, index) => {
            return {
              ...balances[index],
              loading: false,
              ...(await fetchBalanceFrom(
                reserve,
                account,
                balances[index].tokenName,
              )),
              updatedAt: moment().unix(),
            };
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
  }, [account, reserves]);

  const isEndedIncentive = (token: string, round: number) => {
    const moneyPoolTime =
      token === Token.DAI ? daiMoneyPoolTime : tetherMoneyPoolTime;
    return moment().isAfter(
      round === 1
        ? moneyPoolTime[round].startedAt
        : moneyPoolTime[round].endedAt,
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevTvl(tvlLoading ? 0 : tvl);
      setBalances(
        balances.map((balance, index) => {
          if (index > 1) return { ...balance };
          return {
            ...balance,
            expectedIncentiveBefore: balance.expectedIncentiveAfter,
            expectedIncentiveAfter: isEndedIncentive(balance.tokenName, 0)
              ? balance.expectedIncentiveAfter
              : balance.incentiveRound1.add(
                  calcExpectedIncentive(
                    elfiPrice,
                    balance.deposit,
                    calcMiningAPR(
                      elfiPrice,
                      BigNumber.from(reserves[index].totalDeposit),
                    ),
                    balance.updatedAt,
                  ),
                ),
            expectedAdditionalIncentiveBefore:
              balance.expectedAdditionalIncentiveAfter,
            expectedAdditionalIncentiveAfter: !isEndedIncentive(
              balance.tokenName,
              1,
            )
              ? balance.expectedAdditionalIncentiveAfter
              : balance.incentiveRound2.add(
                  calcExpectedIncentive(
                    elfiPrice,
                    balance.deposit,
                    calcMiningAPR(
                      elfiPrice,
                      BigNumber.from(reserves[index].totalDeposit),
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
  }, [tvl, balances]);

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

  return (
    <>
      {reserve && (
        <DepositOrWithdrawModal
          reserve={reserve}
          userData={userConnection?.user}
          tokenName={reserveTokenData[selectedModalToken].name}
          tokenImage={reserveTokenData[selectedModalToken].image}
          visible={!!reserve}
          onClose={() => {
            const queryParams = new URLSearchParams(location.search);

            if (queryParams.has('reserveId')) {
              queryParams.delete('reserveId');
              history.replace({
                search: queryParams.toString(),
              });
            }

            setReserve(undefined);
          }}
          balance={balances[selectedModalNumber].value}
          depositBalance={BigNumber.from(balances[selectedModalNumber].deposit)}
          afterTx={() => loadBalance(selectedModalNumber)}
          transactionModal={() => setTransactionModal(true)}
          round={round}
        />
      )}
      <IncentiveModal
        visible={incentiveModalVisible}
        onClose={() => {
          setIncentiveModalVisible(false);
        }}
        balanceBefore={
          round === 2
            ? balances[selectedModalNumber].expectedAdditionalIncentiveBefore
            : balances[selectedModalNumber].expectedIncentiveBefore
        }
        balanceAfter={
          round === 2
            ? balances[selectedModalNumber].expectedAdditionalIncentiveAfter
            : balances[selectedModalNumber].expectedIncentiveAfter
        }
        incentivePoolAddress={
          round === 2
            ? balances[selectedModalNumber].tokenName === Token.DAI
              ? envs.currentDaiIncentivePool
              : envs.currentUSDTIncentivePool
            : balances[selectedModalNumber].tokenName === Token.DAI
            ? envs.prevDaiIncentivePool
            : envs.prevUSDTIncentivePool
        }
        tokenName={balances[selectedModalNumber].tokenName}
        afterTx={() => loadBalance(selectedModalNumber)}
        transactionModal={() => setTransactionModal(true)}
      />
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

      <div className="deposit">
        <div
          className="deposit__title"
          style={{
            backgroundImage:
              mediaQuery === MediaQuery.PC ? `url(${HeaderCircle})` : '',
          }}>
          <p className="montserrat__bold">Total Value Locked</p>
          <CountUp
            start={prevTvl}
            end={tvlLoading ? 0.0 : tvl}
            formattingFn={(number) => usdFormatter.format(number)}
            decimals={4}
            duration={2}
            delay={0}>
            {({ countUpRef }) => <h2 className="blue" ref={countUpRef} />}
          </CountUp>
        </div>
        <RewardPlanButton stakingType={'deposit'} />
        <div className="deposit__table__wrapper">
          <div className="deposit__remote-control__wrapper">
            <div className="deposit__remote-control">
              {balances.map((data, index) => {
                return (
                  <a
                    key={index}
                    onClick={() => remoteControlScroll(`table-${index}`)}>
                    <div>
                      <div className="deposit__remote-control__images">
                        <img src={reserveTokenData[data.tokenName].image} />
                      </div>
                      <div className="deposit__remote-control__name">
                        <p className="montserrat">{data.tokenName}</p>
                      </div>
                      <p className="deposit__remote-control__apy bold">
                        {toPercent(reserves[index].depositAPY)}
                      </p>
                      <div className="deposit__remote-control__mining">
                        <p>{t('dashboard.token_mining_apr')}</p>
                        <p>
                          {toPercent(
                            calcMiningAPR(
                              elfiPrice,
                              BigNumber.from(reserves[index].totalDeposit),
                              reserveTokenData[data.tokenName].decimals,
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
          {/* remote control end */}

          {balances.map((balance, index) => {
            return (
              <>
                <TokenTable
                  key={index}
                  index={index}
                  id={`table-${index}`}
                  onClick={(e: any) => {
                    walletConnect === false
                      ? (setConnectWalletModalvisible(true),
                        ReactGA.modalview(
                          balance.tokenName +
                            ModalViewType.DepositConnectWalletModal,
                        ))
                      : (e.preventDefault(),
                        setReserve(reserves[index]),
                        setModalNumber(index),
                        setModalToken(balance.tokenName),
                        ReactGA.modalview(
                          balance.tokenName +
                            ModalViewType.DepositOrWithdrawModal,
                        ));
                  }}
                  tokenName={balance.tokenName}
                  tokenImage={reserveTokenData[balance.tokenName].image}
                  depositBalance={toCompactForBignumber(
                    balance.deposit || constants.Zero,
                    reserveTokenData[balance.tokenName].decimals,
                  )}
                  depositAPY={toPercent(reserves[index].depositAPY)}
                  miningAPR={toPercent(
                    calcMiningAPR(
                      elfiPrice,
                      BigNumber.from(reserves[index].totalDeposit),
                      reserveTokenData[balance.tokenName].decimals,
                    ) || '0',
                  )}
                  walletBalance={toCompactForBignumber(
                    balance.value || constants.Zero,
                    reserveTokenData[balance.tokenName].decimals,
                  )}
                  isDisable={!reserves[index]}
                  skeletonLoading={balance.loading}
                  reserveData={reserves[index]}
                  expectedIncentiveBefore={balance.expectedIncentiveBefore}
                  expectedIncentiveAfter={balance.expectedIncentiveAfter}
                  expectedAdditionalIncentiveBefore={
                    balance.expectedAdditionalIncentiveBefore
                  }
                  expectedAdditionalIncentiveAfter={
                    balance.expectedAdditionalIncentiveAfter
                  }
                  setIncentiveModalVisible={() => {
                    walletConnect === false
                      ? (setConnectWalletModalvisible(true),
                        ReactGA.modalview(
                          balance.tokenName + ModalViewType.IncentiveModal,
                        ))
                      : setIncentiveModalVisible(true);
                  }}
                  setModalNumber={() => setModalNumber(index)}
                  modalview={() =>
                    ReactGA.modalview(
                      balance.tokenName + ModalViewType.IncentiveModal,
                    )
                  }
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
