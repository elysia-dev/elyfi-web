import { BigNumber, constants } from 'ethers';
import envs from 'src/core/envs';
import moment from 'moment';
import {
  ERC20__factory,
  IncentivePool__factory,
} from '@elysia-dev/contract-typechain';
import Token from 'src/enums/Token';
import SubgraphContext, { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import { useContext, useEffect, useState } from 'react';
import getTokenNameFromAddress from 'src/utiles/getTokenNameFromAddress';
import isEndedIncentive from 'src/core/utils/isEndedIncentive';
import calcExpectedIncentive from 'src/utiles/calcExpectedIncentive';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import PriceContext from 'src/contexts/PriceContext';
import { useWeb3React } from '@web3-react/core';
import MainnetContext from 'src/contexts/MainnetContext';
import ReserveToken from 'src/core/types/ReserveToken';
import isSupportedToken from 'src/core/utils/isSupportedReserve';

type BalanceType = {
  loading: boolean;
  id: string;
  tokenName: ReserveToken;
  value: BigNumber;
  incentiveRound1: BigNumber;
  incentiveRound2: BigNumber;
  expectedIncentiveBefore: BigNumber;
  expectedIncentiveAfter: BigNumber;
  expectedAdditionalIncentiveBefore: BigNumber;
  expectedAdditionalIncentiveAfter: BigNumber;
  deposit: BigNumber;
  updatedAt: number;
}

const initialBalanceState = {
  loading: true,
  value: constants.Zero,
  incentiveRound1: constants.Zero,
  incentiveRound2: constants.Zero,
  expectedIncentiveBefore: constants.Zero,
  expectedIncentiveAfter: constants.Zero,
  expectedAdditionalIncentiveBefore: constants.Zero,
  expectedAdditionalIncentiveAfter: constants.Zero,
  deposit: constants.Zero,
  id: "",
  updatedAt: moment().unix(),
};

const getIncentiveByRound = async (
  library: any,
  tokenName: ReserveToken,
  account: string,
) => {
  const incentiveRound1 = await IncentivePool__factory.connect(
    tokenName === Token.DAI
      ? envs.prevDaiIncentivePool
      : tokenName === Token.USDT
        ? envs.prevUSDTIncentivePool
        : envs.busdIncentivePoolAddress,
    library.getSigner(),
  ).getUserIncentive(account);

	// USDT & DAI have two incentivepools
	// BSC have only one incentivepool
	const incentiveRound2 = tokenName === Token.BUSD ? incentiveRound1 : await IncentivePool__factory.connect(
		tokenName === Token.DAI
			? envs.currentDaiIncentivePool
			: tokenName === Token.USDT
				? envs.currentUSDTIncentivePool
				: envs.busdIncentivePoolAddress,
		library.getSigner(),
	).getUserIncentive(account);

	return {
		incentiveRound1,
    incentiveRound2,
  };
};

// TODO -> BUSDT는 BSC로 요청하자
// TODO : supported chain만 balance update하기
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
      incentiveRound1,
      incentiveRound2,
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
      deposit: constants.Zero
    }
  }
};

type ReturnType = {
	balances: BalanceType[],
	loadBalance: (id: string) => void,
};

const useBalances = (refetchUserData: () => void): ReturnType => {
	const { account, library } = useWeb3React();
	const { data } = useContext(SubgraphContext);
	const [balances, setBalances] = useState<BalanceType[]>(
		data.reserves
			.map((reserve) => {
				return {
					...initialBalanceState,
					id: reserve.id,
					tokenName: getTokenNameFromAddress(reserve.id) as ReserveToken,
				};
			}),
	);
	const { elfiPrice } = useContext(PriceContext);
	const {
    type: mainnetType,
  } = useContext(MainnetContext)

	const loadBalance = async (id: string) => {
    if (!account) return;
    try {
      refetchUserData();

      setBalances(
        await Promise.all(
          balances.map(async (balance, _index) => {
            const reserve = data.reserves.find(r => r.id === id)
            if (balance.id !== id || !reserve ) return {
              ...balance
            }
            return {
              ...balance,
              updatedAt: moment().unix(),
              ...(await fetchBalanceFrom(reserve, account, library, balance.tokenName)),
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
            .map(async (reserve, index) => {
							const tokenName = getTokenNameFromAddress(reserve.id) as ReserveToken;
							if (!isSupportedToken(tokenName, mainnetType)) {
								return balances[index];
							}

							return {
								id: reserve.id,
								loading: false,
								tokenName,
								updatedAt: moment().unix(),
								...(await fetchBalanceFrom(reserve, account, library, tokenName)),
							} as BalanceType;
						}),
				),
			);
		} catch (error) {
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
        balances.map((balance) => {
          const reserve = data.reserves.find(r => r.id === balance.id)
          if(!reserve) return balance;

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
                      BigNumber.from(reserve.totalDeposit),
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
  }, [balances, mainnetType]);

	return { balances, loadBalance }
};

export default useBalances
