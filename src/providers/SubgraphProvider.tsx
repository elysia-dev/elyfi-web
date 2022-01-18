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
    const mainnetData = await ReserveSubgraph.getEthReserveData()
    const bscData = await ReserveSubgraph.getBscReserveData()

    // FIXME
    // Our subgraph reserve has no child like asset bond tokens at v0.4.0
    setState({
      data: {
        reserves: [
          ...mainnetData.data.data.reserves.map((reserve) => {
            return {
              ...reserve,
              assetBondTokens: mainnetData.data.data.assetBondTokens.filter((ab) => ab.reserve.id === reserve.id)
            }
          }),
          ...bscData.data.data.reserves.map((reserve) => {
            return {
              ...reserve,
              assetBondTokens: bscData.data.data.assetBondTokens.filter((ab) => ab.reserve.id === reserve.id)
            }
          }),
        ],
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