import { useEffect, useState } from 'react';
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

  const fetchSubgraph = async () => {
    if (!ethReserveData || !bscReserveData) return;
    setReserveState({
      reserves: [...bscReserveData, ...ethReserveData],
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
