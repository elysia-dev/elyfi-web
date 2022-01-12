import { useWeb3React } from '@web3-react/core';
import { useContext, useMemo } from "react";
import MainnetContext from "src/contexts/MainnetContext";
import { MainnetData, MainnetList, mainnets } from 'src/core/data/mainnets'
import useCurrentChain from 'src/hooks/useCurrentChain';

const MainnetSwitch: React.FunctionComponent<{
  mainNetwork: boolean;
  setMainNetwork: (value: React.SetStateAction<boolean>) => void;
}> = ({ mainNetwork, setMainNetwork }) => {
  const { active, chainId } = useWeb3React();
  const { 
    type: getMainnetType,
    unsupportedChainid: getMainnetError,
    changeMainnet, 
    setCurrentMainnet 
  } = useContext(MainnetContext)
  const currentChain = useCurrentChain();

  const getChainData = useMemo(() => {
    return mainnets.find((data) => {
      return data.chainId === currentChain?.chainId
    })
  }, [chainId])
  
  return (
    <div className="navigation__mainnet__container">
      <div className="navigation__mainnet__wrapper">
        <div className="navigation__mainnet__current" 
          onClick={() => {
          setMainNetwork(!mainNetwork)
          }}
          style={{
            borderColor: getMainnetError ? "RED" : "#f0f0f1",
            justifyContent: getMainnetError ? "space-around" : "flex-start"
          }}  
        >
          <img 
            src={MainnetData[getMainnetType].image} 
            style={{
              display: getMainnetError ? "none" : "flex"
            }}
          />
          <h2>{active ? (getChainData?.name || "Unknown Mainnet") : getMainnetType}</h2>
        </div>
        <div className="navigation__mainnet__change-network__wrapper" style={{
          display: mainNetwork === true ? "flex" : 'none'
        }}>
          {
            MainnetList
            .filter((data) => {
              return (data.type !== getMainnetType) || getMainnetError
            })
            .map((_data, index) => {
              return (
                <div 
                  key={index}
                  className="navigation__mainnet__change-network" 
                  onClick={() => {
                    active ? (
                      changeMainnet(MainnetData[_data.type].chainId).then(() => {
                        setMainNetwork(false)
                      })
                    ) : (
                      setMainNetwork(false),
                      setCurrentMainnet(_data.type)
                    )
                    // window.location.reload();
                  }}
                >
                  <img src={MainnetData[_data.type].image} />
                  <h2>
                    {MainnetData[_data.type].name}
                  </h2>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default MainnetSwitch;