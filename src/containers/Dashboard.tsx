import { useWeb3React } from '@web3-react/core';
import ReserveData, { reserveTokenData } from 'src/core/data/reserves';
import { useEffect, useContext, useState } from 'react';
import { toPercent, toCompactForBignumber } from 'src/utiles/formatters';
import DepositOrWithdrawModal from 'src/containers/DepositOrWithdrawModal';
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
import WrongMainnetModal from 'src/containers/WrongMainnetModal';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
import ModalViewType from 'src/enums/ModalViewType';
import { useMediaQuery } from 'react-responsive';
import { ReserveSubgraph } from 'src/clients/ReserveSubgraph';
import SubgraphContext, { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';

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
  const { account, library, chainId } = useWeb3React();
  const location = useLocation();
  const history = useHistory();
  const { data } = useContext(SubgraphContext);
  const { elfiPrice } = useContext(PriceContext);
  const reserveId = new URLSearchParams(location.search).get('reserveId');
  const [reserveData, setReserveData] = useState<IReserveSubgraphData | undefined>(
    data.reserves.find((reserve) => reserveId === reserve.id)
  );
  const { t } = useTranslation();
  const [balances, setBalances] = useState<
    {
      loading: boolean;
      tokenName: Token.DAI | Token.USDT | Token.BUSD;
      value: BigNumber;
      incentive: BigNumber;
      expectedIncentiveBefore: BigNumber;
      expectedIncentiveAfter: BigNumber;
      deposit: BigNumber;
      updatedAt: number;
    }[]
  >(
    data.reserves.map((reserve) => {
      return {
        ...initialBalanceState,
        tokenName: reserve.id === envs.usdtAddress ? Token.USDT : reserve.id === envs.daiAddress ? Token.DAI : Token.BUSD
      };
    }),
  );
  const { 
    type: getMainnetType,
    unsupportedChainid
  } = useContext(MainnetContext)

  const [incentiveModalVisible, setIncentiveModalVisible] =
    useState<boolean>(false);
  const { data: userConnection, refetch: refetchUserData } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } },
  );
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedModalNumber, setModalNumber] = useState(0);
  const [selectedModalToken, setModalToken] = useState<Token.DAI | Token.USDT | Token.BUSD>(
    Token.DAI,
  );
  const { value: tvl, loading: tvlLoading } = useTvl();
  const [prevTvl, setPrevTvl] = useState(0);
  const [connectWalletModalvisible, setConnectWalletModalvisible] = useState<boolean>(false);
  const [wrongMainnetModalVisible, setWrongMainnetModalVisible] = useState<boolean>(false);
  const walletConnect = isWalletConnect();
  const { value: mediaQuery } = useMediaQueryType();

  const isEnoughWide = useMediaQuery({
    query: '(min-width: 1439px)',
  });

  useEffect(() => {
    const paramsData = data.reserves.find((_reserve) => reserveId === _reserve.id);
    const tokenInfo = paramsData
      ? ReserveData.findIndex((_reserve) => _reserve.address === paramsData.id)
      : undefined;

    setModalNumber(tokenInfo ? tokenInfo : 0);
  }, [reserveId]);

  const fetchBalanceFrom = async (
    reserve: IReserveSubgraphData,
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
          getMainnetType === MainnetType.BSC ? envs.bscElfiAddress : envs.governanceAddress,
          library,
        ).balanceOf(account),
        deposit: await ERC20__factory.connect(
          reserve.lToken.id,
          library,
        ).balanceOf(account),
      };
    } catch (error) {
      console.log("????")
      console.error(error);
    }
  };

  const loadBalance = async (index: number) => {
    if (!account) return;
    try {
      refetchUserData();

      setBalances(
        await Promise.all(
          balances.map(async (_data, _index) => {
            if (_index !== index) return _data;
            return {
              ..._data,
              ...(await fetchBalanceFrom(data.reserves[index], account)),
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
          data.reserves.map(async (reserve, index) => {
            console.log(await ERC20__factory.connect(reserve.id, library).balanceOf(account))
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
      setPrevTvl(tvlLoading ? 0 : tvl);
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
                  BigNumber.from(data.reserves[index].totalDeposit),
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
      {reserveData && (
        <DepositOrWithdrawModal
          reserve={reserveData}
          userData={userConnection?.user}
          tokenName={reserveTokenData[selectedModalToken].name}
          tokenImage={reserveTokenData[selectedModalToken].image}
          visible={!!reserveData}
          onClose={() => {
            const queryParams = new URLSearchParams(location.search);

            if (queryParams.has('reserveId')) {
              queryParams.delete('reserveId');
              history.replace({
                search: queryParams.toString(),
              });
            }

            setReserveData(undefined);
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
        incentivePoolAddress={data.reserves[selectedModalNumber].incentivePool.id}
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
      <WrongMainnetModal
        visible={wrongMainnetModalVisible}
        onClose={() => {
          setWrongMainnetModalVisible(false);
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
          {
            isEnoughWide && (
              <div className="deposit__remote-control__wrapper">
                <div className="deposit__remote-control">
                  {balances.map((_data, index) => {
                    return (
                      <a onClick={() => remoteControlScroll(`table-${index}`)}>
                        <div>
                          <div className="deposit__remote-control__images">
                            <img src={reserveTokenData[_data.tokenName].image} />
                          </div>
                          <div className="deposit__remote-control__name">
                            <p className="montserrat">{_data.tokenName}</p>
                          </div>
                          <p className="deposit__remote-control__apy bold">
                            {toPercent(data.reserves[index].depositAPY)}
                          </p>
                          <div className="deposit__remote-control__mining">
                            <p>{t('dashboard.token_mining_apr')}</p>
                            <p>
                              {toPercent(
                                calcMiningAPR(
                                  elfiPrice,
                                  BigNumber.from(data.reserves[index].totalDeposit),
                                  reserveTokenData[_data.tokenName].decimals,
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
          
          {balances.map((balance, index) => {
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
                          setReserveData(data.reserves[index]),
                          setModalNumber(index),
                          setModalToken(balance.tokenName),
                          ReactGA.modalview(balance.tokenName + ModalViewType.DepositOrWithdrawModal)
                        )
                  }}
                  tokenName={balance.tokenName}
                  tokenImage={reserveTokenData[balance.tokenName].image}
                  depositBalance={toCompactForBignumber(
                    balance.deposit || constants.Zero,
                    reserveTokenData[balance.tokenName].decimals,
                  )}
                  depositAPY={toPercent(data.reserves[index].depositAPY)}
                  miningAPR={toPercent(
                    calcMiningAPR(
                      elfiPrice,
                      BigNumber.from(data.reserves[index].totalDeposit),
                      reserveTokenData[balance.tokenName].decimals,
                    ) || '0',
                  )}
                  walletBalance={toCompactForBignumber(
                    balance.value || constants.Zero,
                    reserveTokenData[balance.tokenName].decimals,
                  )}
                  isDisable={!data.reserves[index]}
                  skeletonLoading={balance.loading}
                  reserveData={data.reserves[index]}
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
                  setModalNumber={() => setModalNumber(index)}
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
