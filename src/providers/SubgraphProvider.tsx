import { useEffect, useState } from "react";
import { ReserveSubgraph } from "src/clients/ReserveSubgraph";
import SubgraphContext, { IAssetBond, initialReserveSubgraph, IReserveSubgraph } from "src/contexts/SubgraphContext";
import Loading from 'src/components/Loading';
import MainnetType from "src/enums/MainnetType";
import { MainnetData } from "src/core/data/mainnets";

const SubgraphProvider: React.FC = (props) => {
  const [state, setState] = useState<IReserveSubgraph>(initialReserveSubgraph)
  const [loading, setLoading] = useState(true)

  const fetchSubgraph = async () => {
    const reserves = await Promise.all(
      [ReserveSubgraph.getEthReserveData, ReserveSubgraph.getBscReserveData].map(async (fetcth) => {
      const res = await fetcth();
      return res.data.data.reserves.map((reserve) => {
        return {
          ...reserve,
          assetBondTokens: res.data.data.assetBondTokens.filter((ab) => ab.reserve.id === reserve.id)
        }
      })
    }))

    setState({
      data: {
        reserves: reserves.flat(),
      }
    })
  }

  const getAssetBondsByNetwork = (network: MainnetType): IAssetBond[] => {
    const supportedTokens = MainnetData[network].supportedTokens;

    return state.data.reserves.reduce((arr, reserve) => {
      if (supportedTokens.includes(reserve.id)) {
        return [...arr, ...reserve.assetBondTokens]
      } else {
        return arr
      }
    }, [] as IAssetBond[])
  }

  useEffect(() => {
    setLoading(true)
    fetchSubgraph().then(() => {
      setLoading(false)
    })
  }, [])

  if (loading) return <Loading />;

  return (
    <SubgraphContext.Provider
      value={{
        ...state,
        getAssetBondsByNetwork,
      }}
    >
      {props.children}
    </SubgraphContext.Provider>
  );
}

export default SubgraphProvider;