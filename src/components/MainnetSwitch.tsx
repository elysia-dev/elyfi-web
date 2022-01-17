import { useWeb3React } from '@web3-react/core';
import { useContext } from "react";
import MainnetContext from "src/contexts/MainnetContext";
import { MainnetData, MainnetList } from 'src/core/data/mainnets'
import useCurrentChain from 'src/hooks/useCurrentChain';
import MainnetError from 'src/assets/images/network_error.png';

const MainnetSwitch: React.FunctionComponent<{
  mainNetwork: boolean;
  setMainNetwork: (value: React.SetStateAction<boolean>) => void;
}> = ({ mainNetwork, setMainNetwork }) => {
  const { active } = useWeb3React();
  const {
    type: getMainnetType,
    unsupportedChainid: getMainnetError,
    changeMainnet,
    setCurrentMainnet
  } = useContext(MainnetContext)
  const currentChain = useCurrentChain();

  return (
    <div className="navigation__mainnet__container">
      <div className="navigation__mainnet__wrapper">
        <div className={`navigation__mainnet__current ${getMainnetError ? "network-error" : ""}`}
          onClick={() => {
            setMainNetwork(!mainNetwork)
          }}
        >
          <img
            src={getMainnetError ? MainnetError : MainnetData[getMainnetType].image}
          />
          <h2>{active ? (currentChain?.name || "Wrong Network") : getMainnetType}</h2>
        </div>
        <div className={`navigation__mainnet__change-network__wrapper ${getMainnetError ? "network-error" : ""}`} style={{
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