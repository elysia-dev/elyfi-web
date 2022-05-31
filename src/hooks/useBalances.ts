import { BigNumber, constants } from 'ethers';
import envs from 'src/core/envs';
import moment from 'moment';
import useSWR from 'swr';
import {
  ERC20__factory,
  IncentivePool__factory,
} from '@elysia-dev/contract-typechain';
import Token from 'src/enums/Token';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import getTokenNameFromAddress from 'src/utiles/getTokenNameFromAddress';
import isEndedIncentive from 'src/core/utils/isEndedIncentive';
import calcExpectedIncentive from 'src/utiles/calcExpectedIncentive';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { useWeb3React } from '@web3-react/core';
import MainnetContext from 'src/contexts/MainnetContext';
import ReserveToken from 'src/core/types/ReserveToken';
import isSupportedReserveByChainId from 'src/core/utils/isSupportedReserveByChainId';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { IReserveSubgraphData } from 'src/core/types/reserveSubgraph';
import useReserveData from './useReserveData';

export type BalanceType = {
  id: string;
  tokenName: ReserveToken;
  value: BigNumber;
  expectedIncentiveBefore: BigNumber;
  expectedIncentiveAfter: BigNumber;
  expectedAdditionalIncentiveBefore: BigNumber;
  expectedAdditionalIncentiveAfter: BigNumber;
  deposit: BigNumber;
  updatedAt: number;
};

const initialBalanceState = {
  value: constants.Zero,
  expectedIncentiveBefore: constants.Zero,
  expectedIncentiveAfter: constants.Zero,
  expectedAdditionalIncentiveBefore: constants.Zero,
  expectedAdditionalIncentiveAfter: constants.Zero,
  deposit: constants.Zero,
  id: '',
  updatedAt: moment().unix(),
};

const tokenIncentiveAddress = (token: string, isPrevIncentive?: boolean) => {
  switch (token) {
    case Token.USDT:
      return isPrevIncentive
        ? envs.incentivePool.prevUSDTIncentivePool
        : envs.incentivePool.currentUSDTIncentivePool;
    case Token.DAI:
      return isPrevIncentive
        ? envs.incentivePool.prevDaiIncentivePool
        : envs.incentivePool.currentDaiIncentivePool;
    case Token.USDC:
      return envs.incentivePool.currentDaiIncentivePool;
    case Token.BUSD:
    default:
      return envs.incentivePool.busdIncentivePoolAddress;
  }
};

const getIncentiveByRound = async (
  library: any,
  tokenName: ReserveToken,
  account: string,
) => {
  const incentiveRound1 = await IncentivePool__factory.connect(
    tokenIncentiveAddress(tokenName, true),
    library.getSigner(),
  ).getUserIncentive(account);

  // USDT & DAI have two incentivepools
  // BSC have only one incentivepool
  const incentiveRound2 =
    tokenName === Token.BUSD
      ? incentiveRound1
      : await IncentivePool__factory.connect(
          tokenIncentiveAddress(tokenName),
          library.getSigner(),
        ).getUserIncentive(account);

  return {
    incentiveRound1,
    incentiveRound2,
  };
};

const fetchBalanceFrom = async (
  reserve: IReserveSubgraphData,
  account: string,
  library: any,
  tokenName: ReserveToken,
) => {
  try {
    const { incentiveRound1, incentiveRound2 } = await getIncentiveByRound(
      library,
      tokenName,
      account,
    );

    return {
      value: await ERC20__factory.connect(reserve.id, library).balanceOf(
        account,
      ),
      expectedIncentiveBefore: incentiveRound1,
      expectedIncentiveAfter: incentiveRound1,
      expectedAdditionalIncentiveBefore: incentiveRound2,
      expectedAdditionalIncentiveAfter: incentiveRound2,
      deposit: await ERC20__factory.connect(
        reserve.lToken.id,
        library,
      ).balanceOf(account),
    };
  } catch (error) {
    return {
      value: constants.Zero,
      incentiveRound1: constants.Zero,
      incentiveRound2: constants.Zero,
      expectedIncentiveBefore: constants.Zero,
      expectedIncentiveAfter: constants.Zero,
      expectedAdditionalIncentiveBefore: constants.Zero,
      expectedAdditionalIncentiveAfter: constants.Zero,
      deposit: constants.Zero,
    };
  }
};

type ReturnType = {
  balances: BalanceType[];
  loadBalance: (id: string) => void;
  loading: boolean;
};

// ! FIXME
// 1. Use other naming. Balance dose not cover the usefulness
const useBalances = (refetchUserData: () => void): ReturnType => {
  const { account, chainId, library } = useWeb3React();
  const { reserveState } = useReserveData();
  const [balances, setBalances] = useState<BalanceType[]>(
    reserveState.reserves.map((reserve) => {
      return {
        ...initialBalanceState,
        id: reserve.id,
        tokenName: getTokenNameFromAddress(reserve.id) as ReserveToken,
      };
    }),
  );
  const [loading, setLoading] = useState(true);
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );
  const { active } = useContext(MainnetContext);

  const elfiPrice = priceData ? priceData.elfiPrice : 0;

  const loadBalance = useCallback(
    async (id: string) => {
      if (!account) return;
      try {
        refetchUserData();

        setBalances(
          await Promise.all(
            balances.map(async (balance, _index) => {
              const reserve = reserveState.reserves.find((r) => r.id === id);
              if (balance.id !== id || !reserve)
                return {
                  ...balance,
                };
              return {
                ...balance,
                updatedAt: moment().unix(),
                ...(await fetchBalanceFrom(
                  reserve,
                  account,
                  library,
                  balance.tokenName,
                )),
              };
            }),
          ),
        );
      } catch (error) {
        console.error(error);
      }
    },
    [reserveState, balances],
  );

  const loadBalances = useCallback(async () => {
    if (!account) {
      return;
    }
    try {
      refetchUserData();
      setBalances(
        await Promise.all(
          reserveState.reserves.map(async (reserve, index) => {
            const tokenName = getTokenNameFromAddress(
              reserve.id,
            ) as ReserveToken;
            if (!isSupportedReserveByChainId(tokenName, chainId)) {
              return balances[index];
            }

            return {
              id: reserve.id,
              tokenName,
              updatedAt: moment().unix(),
              ...(await fetchBalanceFrom(reserve, account, library, tokenName)),
            } as BalanceType;
          }),
        ),
      );
    } catch (error) {
      setBalances(
        balances.map((reserveData) => {
          return {
            ...reserveData,
          };
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [account, library, chainId, reserveState]);

  useEffect(() => {
    // Only called when active.
    // When active is false, balance is allways zero
    if (!account || !active) return;
    setLoading(true);
    loadBalances();
  }, [account, active, chainId, reserveState]);

  useEffect(() => {
    setBalances(
      reserveState.reserves.map((reserve) => {
        return {
          ...initialBalanceState,
          id: reserve.id,
          tokenName: getTokenNameFromAddress(reserve.id) as ReserveToken,
        };
      }),
    );
  }, [reserveState]);

  useEffect(() => {
    if (loading || !active || !priceData) return;

    const interval = setInterval(() => {
      setBalances(
        balances.map((balance) => {
          const reserve = reserveState.reserves.find((r) =>
            balance ? r.id === balance.id : false,
          );
          if (!reserve) return balance;

          return {
            ...balance,
            expectedIncentiveBefore: balance.expectedIncentiveAfter,
            expectedIncentiveAfter: isEndedIncentive(balance.tokenName, 0)
              ? balance.expectedIncentiveAfter
              : balance.expectedIncentiveAfter.add(
                  calcExpectedIncentive(
                    elfiPrice,
                    balance.deposit,
                    calcMiningAPR(
                      elfiPrice,
                      BigNumber.from(reserve.totalDeposit || 0),
                    ),
                    balance.updatedAt,
                  ),
                ),
            expectedAdditionalIncentiveBefore:
              balance.expectedAdditionalIncentiveAfter,
            expectedAdditionalIncentiveAfter: isEndedIncentive(
              balance.tokenName,
              1,
            )
              ? balance.expectedAdditionalIncentiveAfter
              : balance.expectedAdditionalIncentiveAfter.add(
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
            updatedAt: moment().unix(),
          };
        }),
      );
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [balances, chainId, loading, active, reserveState, priceData]);

  return { balances, loading, loadBalance };
};

export default useBalances;
