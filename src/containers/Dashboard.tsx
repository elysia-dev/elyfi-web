import { useWeb3React } from '@web3-react/core';
import ReserveData, { reserveTokenData } from 'src/core/data/reserves';
import { useEffect, useContext, useState } from 'react';
import { formatEther } from '@ethersproject/units';
import {
  toPercent,
  toCompactForBignumber,
  formatSixFracionDigit,
} from 'src/utiles/formatters';
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
import { Title } from 'src/components/Texts';
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
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
import ConnectWalletModal from './ConnectWalletModal';

const initialBalanceState = {
  loading: false,
  value: constants.Zero,
  incentive: constants.Zero,
  expectedIncentiveBefore: constants.Zero,
  expectedIncentiveAfter: constants.Zero,
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
  const { reserves, refetch: refetchReserve } = useContext(ReservesContext);
  const { elfiPrice } = useContext(PriceContext);
  const reserveId = new URLSearchParams(location.search).get('reserveId');
  const [reserve, setReserve] = useState<GetAllReserves_reserves | undefined>(
    reserves.find((reserve) => reserveId === reserve.id),
  );
  const { t } = useTranslation();
  const [balances, setBalances] = useState<
    {
      loading: boolean;
      tokenName: Token.DAI | Token.USDT;
      value: BigNumber;
      incentive: BigNumber;
      expectedIncentiveBefore: BigNumber;
      expectedIncentiveAfter: BigNumber;
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
  const walletConnect = isWalletConnect();

  useEffect(() => {
    const paramsData = reserves.find((_reserve) => reserveId === _reserve.id);
    const tokenInfo = paramsData
      ? ReserveData.findIndex((_reserve) => _reserve.address === paramsData.id)
      : undefined;

    setModalNumber(tokenInfo ? tokenInfo : 0);
  }, [reserveId]);

  const fetchBalanceFrom = async (
    reserve: GetAllReserves_reserves,
    account: string,
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
      refetchReserve();
      refetchUserData();

      setBalances(
        await Promise.all(
          balances.map(async (data, _index) => {
            if (_index !== index) return data;
            return {
              ...data,
              ...(await fetchBalanceFrom(reserves[index], account)),
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
      refetchReserve();
      refetchUserData();
      setBalances(
        await Promise.all(
          reserves.map(async (reserve, index) => {
            return {
              ...balances[index],
              loading: false,
              ...(await fetchBalanceFrom(reserve, account)),
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
  }, [account]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevTvl(tvl);
      setBalances(
        balances.map((balance, index) => {
          if (index > 1) return { ...balance };
          return {
            ...balance,
            expectedIncentiveBefore: balance.expectedIncentiveAfter,
            expectedIncentiveAfter: balance.incentive.add(
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
        />
      )}
      <IncentiveModal
        visible={incentiveModalVisible}
        onClose={() => {
          setIncentiveModalVisible(false);
        }}
        balanceBefore={balances[selectedModalNumber].expectedIncentiveBefore}
        balanceAfter={balances[selectedModalNumber].expectedIncentiveAfter}
        incentivePoolAddress={reserves[selectedModalNumber].incentivePool.id}
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
          style={{ backgroundImage: `url(${HeaderCircle})` }}>
          <p className="montserrat__bold">Total Value Locked</p>
          <CountUp
            start={prevTvl}
            end={tvl}
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
                  <a onClick={() => remoteControlScroll(`table-${index}`)}>
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
                      ? setConnectWalletModalvisible(true)
                      : (e.preventDefault(),
                        setReserve(reserves[index]),
                        setModalNumber(index),
                        setModalToken(balance.tokenName),
                        ReactGA.modalview('DepositOrWithdraw'));
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
                  setIncentiveModalVisible={() => {
                    walletConnect === false
                      ? setConnectWalletModalvisible(true)
                      : setIncentiveModalVisible(true);
                  }}
                  setModalNumber={() => setModalNumber(index)}
                  modalview={() => ReactGA.modalview('Incentive')}
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
