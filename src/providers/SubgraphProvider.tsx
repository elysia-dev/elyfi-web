import { useContext, useEffect, useMemo, useState } from "react";
import { ReserveSubgraph } from "src/clients/ReserveSubgraph";
import SubgraphContext, { initialReserveSubgraph, IReserveSubgraph } from "src/contexts/SubgraphContext";
import Loading from 'src/components/Loading';
import MainnetContext from "src/contexts/MainnetContext";
import { MainnetData } from "src/core/data/mainnets";

const SubgraphProvider: React.FC = (props) => {
  const [state, setState] = useState<IReserveSubgraph>(initialReserveSubgraph)
  const [loading, setLoading] = useState(true)

  const fetchSubgraph = async () => {
    const mainnetData = await ReserveSubgraph.getEthReserveData()
    const bscData = await ReserveSubgraph.getBscReserveData()

    setState({
      data: {
        reserves: [
          ...mainnetData.data.data.reserves,
          ...bscData.data.data.reserves
        ]
      }
    })
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
      value={state}
    >
      {props.children}
    </SubgraphContext.Provider>
  );
}

export default SubgraphProvider;