import { BigNumber, constants } from 'ethers';
import envs from 'src/core/envs';
import moment from 'moment';
import {
  ERC20__factory,
  IncentivePool__factory,
} from '@elysia-dev/contract-typechain';
import Token from 'src/enums/Token';
import SubgraphContext, {
  IReserveSubgraphData,
} from 'src/contexts/SubgraphContext';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import getTokenNameFromAddress from 'src/utiles/getTokenNameFromAddress';
import PriceContext from 'src/contexts/PriceContext';
import { useWeb3React } from '@web3-react/core';
import MainnetContext from 'src/contexts/MainnetContext';
import ReserveToken from 'src/core/types/ReserveToken';
import isSupportedReserveByChainId from 'src/core/utils/isSupportedReserveByChainId';

type incentiveType = {
  beforeRound1: BigNumber;
  afterRound1: BigNumber;
  beforeRound2: BigNumber;
  afterRound2: BigNumber;
};

export type BalanceType = {
  id: string;
  tokenName: ReserveToken;
  value: BigNumber;
  expectedIncentive: {
    DAI: incentiveType;
    USDT: incentiveType;
    BUSD: incentiveType;
  };
  deposit: BigNumber;
  updatedAt: number;
};

const initialIncentive = {
  beforeRound1: constants.Zero,
  afterRound1: constants.Zero,
  beforeRound2: constants.Zero,
  afterRound2: constants.Zero,
};

const initialBalanceState = {
  value: constants.Zero,
  expectedIncentive: {
    DAI: initialIncentive,
    USDT: initialIncentive,
    BUSD: initialIncentive,
  },
  deposit: constants.Zero,
  id: '',
  updatedAt: moment().unix(),
};

const getIncentiveByRound = async (
  library: any,
  tokenName: ReserveToken,
  account: string,
) => {
  const incentiveRound1 = await IncentivePool__factory.connect(
    tokenName === Token.DAI
      ? envs.moneyPool.prevDaiIncentivePool
      : tokenName === Token.USDT
      ? envs.moneyPool.prevUSDTIncentivePool
      : envs.moneyPool.busdIncentivePoolAddress,
    library.getSigner(),
  ).getUserIncentive(account);

  // USDT & DAI have two incentivepools
  // BSC have only one incentivepool
  const incentiveRound2 =
    tokenName === Token.BUSD
      ? incentiveRound1
      : await IncentivePool__factory.connect(
          tokenName === Token.DAI
            ? envs.moneyPool.currentDaiIncentivePool
            : tokenName === Token.USDT
            ? envs.moneyPool.currentUSDTIncentivePool
            : envs.moneyPool.busdIncentivePoolAddress,
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

    const incentiveByRound = {
      beforeRound1: incentiveRound1,
      afterRound1: incentiveRound1,
      beforeRound2: incentiveRound2,
      afterRound2: incentiveRound2,
    };

    return {
      value: await ERC20__factory.connect(reserve.id, library).balanceOf(
        account,
      ),
      expectedIncentive: {
        DAI: incentiveByRound,
        USDT: incentiveByRound,
        BUSD: incentiveByRound,
      },
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
      expectedIncentive: {
        DAI: initialIncentive,
        USDT: initialIncentive,
        BUSD: initialIncentive,
      },
      deposit: constants.Zero,
    };
  }
};

type ReturnType = {
  balances: BalanceType[];
  loadBalance: (id: string) => void;
  loading: boolean;
  setBalances: Dispatch<SetStateAction<BalanceType[]>>;
};

// ! FIXME
// 1. Use other naming. Balance dose not cover the usefulness
const useBalances = (refetchUserData: () => void): ReturnType => {
  const { account, library, chainId } = useWeb3React();
  const { data } = useContext(SubgraphContext);
  const [balances, setBalances] = useState<BalanceType[]>(
    data.reserves.map((reserve) => {
      return {
        ...initialBalanceState,
        id: reserve.id,
        tokenName: getTokenNameFromAddress(reserve.id) as ReserveToken,
      };
    }),
  );
  const [loading, setLoading] = useState(true);
  const { elfiPrice } = useContext(PriceContext);
  const { type: mainnetType, active } = useContext(MainnetContext);

  const loadBalance = async (id: string) => {
    if (!account) return;
    try {
      refetchUserData();

      setBalances(
        await Promise.all(
          balances.map(async (balance, _index) => {
            const reserve = data.reserves.find((r) => r.id === id);
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
  };

  const loadBalances = useCallback(async () => {
    if (!account) {
      return;
    }

    try {
      refetchUserData();
      setBalances(
        await Promise.all(
          data.reserves.map(async (reserve, index) => {
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
        balances.map((data) => {
          return {
            ...data,
          };
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [account, library, chainId]);

  useEffect(() => {
    // Only called when active.
    // When active is false, balance is allways zero
    if (!account || !active) return;
    setLoading(true);
    loadBalances();
  }, [account, active, chainId]);

  return { balances, loading, loadBalance, setBalances };
};

export default useBalances;
