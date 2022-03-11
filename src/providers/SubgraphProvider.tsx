import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  bscReserveDataFetcher,
  ethReserveDataFetcher,
} from 'src/clients/ReserveSubgraph';
import SubgraphContext, {
  IAssetBond,
  initialReserveSubgraph,
  IReserveSubgraph,
} from 'src/contexts/SubgraphContext';
import MainnetType from 'src/enums/MainnetType';
import { MainnetData } from 'src/core/data/mainnets';
import {
  bscReserveMiddleware,
  ethReserveMiddleware,
} from 'src/middleware/reservesMiddleware';

const SubgraphProvider: React.FC = (props) => {
  const [state, setState] = useState<IReserveSubgraph>(initialReserveSubgraph);
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
    setState({
      data: {
        reserves: [...bscReserveData, ...ethReserveData],
      },
      loading: ethLoading || bscLoading,
    });
  };

  const getAssetBondsByNetwork = (network: MainnetType): IAssetBond[] => {
    const supportedTokens = MainnetData[network].supportedTokens;

    return state.data.reserves.reduce((arr, reserve) => {
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

  return (
    <SubgraphContext.Provider
      value={{
        ...state,
        getAssetBondsByNetwork,
      }}>
      {props.children}
    </SubgraphContext.Provider>
  );
};

export default SubgraphProvider;
