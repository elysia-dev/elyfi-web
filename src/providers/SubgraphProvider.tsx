import MainnetContext from "src/contexts/MainnetContext";
import { useContext, useEffect, useMemo, useState } from "react";
import MainnetType from "src/enums/MainnetType";
import { ReserveSubgraph } from "src/clients/ReserveSubgraph";
import SubgraphContext, { initialReserveSubgraph, IReserveSubgraph } from "src/contexts/SubgraphContext";
import { useWeb3React } from "@web3-react/core";
import Loading from 'src/components/Loading';

const SubgraphProvider: React.FC = (props) => {
  const [state, setState] = useState<IReserveSubgraph>(initialReserveSubgraph)
  const [loading, setLoading] = useState(true)

  const { chainId } = useWeb3React();
  const { 
    type: getMainnetType
  } = useContext(MainnetContext)

  useEffect(() => {
    setLoading(true)
    console.log(getMainnetType)
    getMainnetType === MainnetType.Ethereum ?
      ReserveSubgraph.getEthReserveData().then((res) => {
        setState(res.data)
        setLoading(false)
      }) : 
      ReserveSubgraph.getBscReserveData().then((res) => {
        setState(res.data)
        setLoading(false)
      })
  }, [getMainnetType])


  if (loading) return <Loading />;

  return (
    <SubgraphContext.Provider
      value={state}>
      {props.children}
    </SubgraphContext.Provider>
  );
}

export default SubgraphProvider;