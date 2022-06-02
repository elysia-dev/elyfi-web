import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import {
  bscReserveDataFetcher,
  ethReserveDataFetcher,
} from 'src/clients/ReserveSubgraph';

import MainnetType from 'src/enums/MainnetType';
import { MainnetData } from 'src/core/data/mainnets';
import {
  bscReserveMiddleware,
  ethReserveMiddleware,
} from 'src/middleware/reservesMiddleware';
import {
  IAssetBond,
  initialReserveSubgraph,
  IReserveSubgraph,
} from 'src/core/types/reserveSubgraph';
import envs from 'src/core/envs';

const useReserveData = (): {
  reserveState: IReserveSubgraph;
  getAssetBondsByNetwork: (network: MainnetType) => IAssetBond[];
  loading: boolean;
} => {
  const [reserveState, setReserveState] = useState<IReserveSubgraph>(
    initialReserveSubgraph,
  );
  const [loading, setLoading] = useState(true);
  const { data: bscReserveData, isValidating: bscLoading } = useSWR(
    'bscReserveData',
    bscReserveDataFetcher,
    {
      use: [bscReserveMiddleware],
    },
  );

  const { data: ethReserveData, isValidating: ethLoading } = useSWR(
    'ethReserveData',
    ethReserveDataFetcher,
    {
      use: [ethReserveMiddleware],
    },
  );
  // const testUSDCData = useMemo(() => {
  //   if (!ethReserveData) return;
  //   return {
  //     id: envs.token.usdcAddress,
  //     lTokenInterestIndex: ethReserveData[0].lTokenInterestIndex,
  //     lastUpdateTimestamp: ethReserveData[0].lastUpdateTimestamp,
  //     borrowAPY: ethReserveData[0].borrowAPY,
  //     depositAPY: ethReserveData[0].depositAPY,
  //     totalBorrow: ethReserveData[0].totalBorrow,
  //     totalDeposit: ethReserveData[0].totalDeposit,
  //     lTokenUserBalanceCount: ethReserveData[0].lTokenUserBalanceCount,
  //     dTokenUserBalanceCount: ethReserveData[0].dTokenUserBalanceCount,
  //     deposit: ethReserveData[0].deposit,
  //     incentivePool: ethReserveData[0].incentivePool,
  //     borrow: ethReserveData[0].borrow,
  //     repay: ethReserveData[0].repay,
  //     reserveHistory: ethReserveData[0].reserveHistory,
  //     lToken: ethReserveData[0].lToken,
  //     assetBondTokens: ethReserveData[0].assetBondTokens,
  //   };
  // }, [ethReserveData]);

  const fetchSubgraph = async () => {
    if (!ethReserveData || !bscReserveData) return;
    // if (!testUSDCData) return;
    setReserveState({
      reserves: [
        {
          id: envs.token.usdcAddress,
          lTokenInterestIndex: ethReserveData[0].lTokenInterestIndex,
          lastUpdateTimestamp: ethReserveData[0].lastUpdateTimestamp,
          borrowAPY: ethReserveData[0].borrowAPY,
          depositAPY: ethReserveData[0].depositAPY,
          totalBorrow: ethReserveData[0].totalBorrow,
          totalDeposit: ethReserveData[0].totalDeposit,
          lTokenUserBalanceCount: ethReserveData[0].lTokenUserBalanceCount,
          dTokenUserBalanceCount: ethReserveData[0].dTokenUserBalanceCount,
          deposit: ethReserveData[0].deposit,
          incentivePool: ethReserveData[0].incentivePool,
          borrow: ethReserveData[0].borrow,
          repay: ethReserveData[0].repay,
          reserveHistory: ethReserveData[0].reserveHistory,
          lToken: ethReserveData[0].lToken,
          assetBondTokens: ethReserveData[0].assetBondTokens,
        },
        ...bscReserveData,
        ...ethReserveData,
      ],
    });
    setLoading(ethLoading || bscLoading);
  };

  const getAssetBondsByNetwork = (network: MainnetType): IAssetBond[] => {
    const supportedTokens =
      MainnetData[network === MainnetType.BSCTest ? MainnetType.BSC : network]
        .supportedTokens;

    return reserveState.reserves.reduce((arr, reserve) => {
      if (supportedTokens.includes(reserve.id)) {
        return [...arr, ...reserve.assetBondTokens];
      } else {
        return arr;
      }
    }, [] as IAssetBond[]);
  };

  useEffect(() => {
    fetchSubgraph();
  }, [bscReserveData, ethReserveData]);

  return { reserveState, getAssetBondsByNetwork, loading };
};

export default useReserveData;
